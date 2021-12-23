/** @jsx jsx */
import createEmotionServer, {
  EmotionServer,
} from '@emotion/server/create-instance'
import { dirs, log } from 'boot'
import { fetch } from 'cross-fetch'
import { FastifyReply, FastifyRequest } from 'fastify'
import { requestContext } from 'fastify-request-context'
import { ellapsedTime, waitUntil } from 'libs'
import { generate, parse, template, traverse, types } from 'libs/babel'
import { pathExists, readFile, writeFile } from 'libs/fs'
import parseHTML from 'node-html-parser'
import { join } from 'path'
import serializeJavascript from 'serialize-javascript'
import { Layout, PlatformGlobal } from 'src/types'
import { ssrWindow } from 'ssr-window'
import { Writable } from 'stream'
import type {} from '../../../../app/web/base'
import { findPage } from '../../../web/init/src/core/page/util'
import type { BaseHtml } from '../../../web/init/src/start'
import { BaseWindow } from '../../../web/init/src/window'
import { initPage } from './route-init'
import { isFile } from './route-public'
import escapeHtml from './ssr/html'

declare const global: PlatformGlobal

export const streamMain = async (
  req: FastifyRequest,
  reply: FastifyReply,
  url: string
) => {
  const baseDir = global.buildPath.public
  const indexPath = join(baseDir, 'index.js')

  if (await isFile(indexPath)) {
    const window = await initWindow(url)
    const init = await initPage(req, reply)

    if (init) {
      let layout = { html: '', css: '' }
      if (!url.startsWith('/__ssr/layout') && global.mode !== 'dev') {
        const page = findPage(url, init.cms_pages as any)
        if (page && init.cms_layouts[page.lid]) {
          const layoutFound = global.cache.layout[page.lid]
          layout = await renderLayoutHtml({
            layout: layoutFound,
            init,
            page,
            window,
          })
          tryUpdateLayoutSSR(page)
        }
      }

      for (let [k, v] of Object.entries(init)) {
        window[k] = v
      }

      const starter = (await import(indexPath + '#' + global.assetStamp)) as {
        html: BaseHtml
        default: typeof ssr
      }

      let { error, html, layoutSSR } = await renderRootHtml({
        starter,
        init,
        url,
        window,
      })

      if (url.startsWith('/__ssr/layout')) {
        let id = url.split('/').pop()
        if (id) await saveSSRLayout(id, layoutSSR)
      }

      reply.code(error ? 500 : 200)
      reply.type('text/html')

      if (layout.css) {
        html = html.replace('</title>', `</title>${layout.css}`)
      }

      html = html.replace(
        '<div id="server-root"></div>',
        `<div id="server-root" data-ssr>${layout.html}</div>`
      )

      reply.send(html)
    }
  } else {
    reply.code(404)
    reply.send('404 - Not Found')
  }
}

export const initWindow = async (url: string) => {
  const window = ssrWindow as any
  window.location.pathname = url
  window.cli_port = global.port
  window.cms_components = global.componentList
  window.isSSR = true

  requestContext.set('window', window)
  global.requestContext = requestContext
  return window
}

export const renderLayoutHtml = async ({
  layout,
  init,
  page,
  window,
}: {
  layout: Layout
  init: Awaited<ReturnType<typeof initPage>>
  page: ReturnType<typeof findPage>
  window: BaseWindow
}) => {
  return new Promise<{ css: string; html: string }>(async (resolve) => {
    if (init && page) {
      if (!layout.jsx) {
        await waitUntil(() => layout.jsx)
      }
      if (layout.jsx) {
        init.cms_layouts[page.lid].source = `
    let win = null
    if (typeof global !== 'undefined' && typeof window === 'undefined') {
      if (global.generateIndexHTML && global.generateIndexHTML.window) {
        win = global.generateIndexHTML.window
      } else if (global.requestContext) {
        win = global.requestContext.get('window')
      }
    } else {
      win = window
    }
    ((window) => {
      const { document, location } = window;
      ${layout.jsx.code}
    })(win)`
      }

      if (layout.ssr !== false) {
        const ssrLayoutPath = join(
          dirs.app.web,
          'src',
          'base',
          'layout',
          `${layout.id}.ssr.ts`
        )

        let ssrLayout = ''

        if (await pathExists(ssrLayoutPath)) {
          ssrLayout = await readFile(ssrLayoutPath, 'utf-8')
        } else {
          ssrLayout = defaultSSRLayout
        }

        if (!ssrLayout) {
          resolve({ html: '', css: '' })
          return
        }

        const runSSRLayout: typeof ssr = async ({ render, css }) => {
          let html = render({
            html: escapeHtml,
            window: window as any,
          }) as string

          if (!global.cache.ssrstamp) {
            global.cache.ssrstamp = {}
          }

          resolve({ html, css: (css || []).join('\n') })
        }

        const transformed = (
          await global.bin.esbuild.transform(ssrLayout, {
            target: 'node' + process.versions.node,
            format: 'esm',
          })
        ).code

        new Function(
          `const ssr = this.ssr;
        ${transformed}`
        ).bind({ ssr: runSSRLayout })()
      }
    }
  })
}

export const renderRootHtml = async ({ starter, init, url, window }) => {
  // react is defined after starter.default called
  const { App, jsx, CacheProvider } = await starter.default(
    window,
    starter.html
  )
  await import('../../../web/init/src/core/window')

  if (global.generateIndexHTML) {
    window.is_dev = false
    init.is_dev = false
  }

  const ReactDOMServer = await import('react-dom/server')
  const renderStream = (ReactDOMServer as any).renderToPipeableStream

  let app = <></>
  let emotion = null as EmotionServer | null

  for (let i of Object.values(init.cms_layouts) as any) {
    if (typeof i === 'object' && i) {
      delete i.running
      delete i.render
      delete i.component
    }
  }
  if (url.startsWith('/__ssr/layout')) {
    const createCache = (await import('@emotion/cache')).default
    const emotionCache = createCache({ key: 'css' })
    app = (
      <CacheProvider value={emotionCache}>
        <App ssr={serializeJavascript(init)} />
      </CacheProvider>
    )
    emotion = createEmotionServer(emotionCache)
  } else {
    app = <App ssr={serializeJavascript(init)} />
  }

  const render = async () => {
    return await new Promise<{
      error: boolean
      html: string
      layoutSSR?: any
    }>((resolve) => {
      let didError = false

      const { pipe }: { pipe: <T extends Writable>(destination: T) => T } =
        renderStream(app, {
          bootstrapModules: [global.assets['index.js']],
          async onCompleteShell() {
            const text: any[] = []
            pipe(
              new Writable({
                write: (a: Buffer, b, c) => {
                  text.push(a)
                  c()
                },
                final: async () => {
                  const html = Buffer.concat(text).toString('utf-8')

                  let layout = undefined as any
                  if (emotion) {
                    const {
                      extractCriticalToChunks,
                      constructStyleTagsFromChunks,
                    } = emotion

                    const chunks = extractCriticalToChunks(html)
                    const cssStyles = constructStyleTagsFromChunks(chunks)
                    const root = parseHTML(html)

                    const clientHTML =
                      root.querySelector('#server-root')?.innerHTML

                    if (clientHTML) {
                      let id = url.split('/').pop()
                      layout = {
                        clientHTML,
                        cssLinks: Object.keys(global.cssLoader),
                        cssStyles,
                      }
                    }
                  }
                  resolve({
                    error: didError,
                    html,
                    layoutSSR: layout,
                  })
                },
              })
            )
          },
          onError(x: any) {
            didError = true
            log(
              `error`,
              `ERROR at app/web/page/${init.cms_id}.base.tsx [URL ${url}]`
            )
            console.log('   ' + x.stack.replaceAll(`#${global.assetStamp}`, ''))
          },
        })
    })
  }

  const w = window as BaseWindow & Window
  let result = await render()
  while (Object.values(w.cms_components).filter((e) => e.loading).length) {
    await waitUntil(() => 100)
    result = await render()
  }

  result = await render()
  return result
}

// get html from client (because rendering html on ssr is *very* hard)
// and get css link from server (it is sent to platform from cssLoader at pkgs/main)
// also get emotion css from server
export const saveSSRLayout = async (
  id: string,
  opt: { clientHTML: string; cssLinks: string[]; cssStyles: string }
) => {
  let ssrLayoutPath = join(
    dirs.app.web,
    'src',
    'base',
    'layout',
    `${id}.ssr.ts`
  )

  let ssrLayout = ''
  if (await pathExists(ssrLayoutPath)) {
    ssrLayout = await readFile(ssrLayoutPath, 'utf-8')
  }

  const parsed = parse(ssrLayout, {
    sourceType: 'module',
    plugins: ['jsx', 'typescript'],
  })

  traverse(parsed, {
    CallExpression(path) {
      const c = path.node
      if (c.callee.type === 'Identifier' && c.callee.name === 'ssr') {
        if (
          c.arguments.length === 1 &&
          c.arguments[0] &&
          c.arguments[0].type === 'ObjectExpression'
        ) {
          let found = false
          for (let arg of c.arguments[0].properties) {
            if (
              arg.type === 'ObjectProperty' &&
              arg.key.type === 'Identifier' &&
              arg.key.name === 'css'
            ) {
              found = true
            }
          }
          if (!found) {
            c.arguments[0].properties.push(
              types.objectProperty(
                types.identifier('css'),
                types.arrayExpression()
              )
            )
          }
        }
      }
    },
    TaggedTemplateExpression(path) {
      const c = path.node
      if (
        c.start &&
        c.end &&
        c.tag.type === 'Identifier' &&
        c.tag.name === 'html' &&
        c.quasi.type === 'TemplateLiteral'
      ) {
        c.quasi.quasis[0].value.raw = opt.clientHTML.replace(/\`/gi, '`')
        c.quasi.quasis[0].value.cooked = c.quasi.quasis[0].value.raw
      }
    },
    ObjectProperty(path) {
      if (global.hostname) {
        const c = path.node
        if (
          c.key.type === 'Identifier' &&
          c.key.name === 'css' &&
          c.value.type === 'ArrayExpression' &&
          c.value.start &&
          c.value.end
        ) {
          const val = JSON.stringify([
            ...opt.cssLinks.map(
              (e) => `<link rel="stylesheet" data-ssr href="${e}"/>`
            ),
            opt.cssStyles,
          ])
          const t = template(val)() as any
          c.value = t.expression
        }
      }
    },
  })
  ssrLayout = global.bin.prettier.format(generate(parsed).code, {
    parser: 'babel-ts',
    semi: false,
  })
  await writeFile(ssrLayoutPath, ssrLayout)
}

const layoutSSRCache = {} as Record<
  string,
  { mode: 'manual' | 'auto'; interval: number; lastUpdate: number }
>

export const tryUpdateLayoutSSR = async (
  page: Exclude<ReturnType<typeof findPage>, false>
) => {
  const layout = layoutSSRCache[page.lid]
  if (!layout || ellapsedTime(layout.lastUpdate) > layout.interval) {
    await updateLayoutSSR(page)
  }
}

const updateLayoutSSR = (page: Exclude<ReturnType<typeof findPage>, false>) => {
  return new Promise<void>(async (resolve) => {
    if (layoutSSRCache[page.lid]) {
      layoutSSRCache[page.lid].lastUpdate = new Date().getTime()
    }

    let ssrLayout = await readFile(
      join(dirs.app.web, 'src', 'base', 'layout', `${page.lid}.ssr.ts`),
      'utf-8'
    )

    if (!ssrLayout) {
      ssrLayout = defaultSSRLayout
      await writeFile(
        join(dirs.app.web, 'src', 'base', 'layout', `${page.lid}.ssr.ts`),
        ssrLayout
      )
    }

    new Function(
      `const ssr = this.ssr;
${
  (
    await global.bin.esbuild.transform(ssrLayout, {
      target: 'node' + process.versions.node,
      format: 'esm',
    })
  ).code
}`
    ).bind({
      ssr: async ({ update }) => {
        layoutSSRCache[page.lid] = {
          mode: update.mode,
          interval: 10,
          lastUpdate: new Date().getTime(),
        }

        await fetch(
          `http://localhost:${global.port}/__ssr/layout/${page.lid}`,
          {
            headers: {
              accept: 'text/html',
            },
          }
        )
        resolve()
      },
    })()
  })
}

const defaultSSRLayout = `
ssr({
  update: {
    mode: 'auto',
    interval: 10, // in seconds
  },
  css: [],
  render({ html, window }) {
    return html\`\`;
  }
})`
