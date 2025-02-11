import { FastifyReply, FastifyRequest } from 'fastify'
import { matchRoute } from 'libs'
import serializeJavascript from 'serialize-javascript'
import { ext as extServer } from 'server'
import { ServerInstance } from 'src/server'
import { loadSession } from 'src/session/session-loader'
import { Layout, PlatformGlobal } from 'src/types'
import { api } from 'web-utils/src/api'
import { routeAPI } from './route-api'
import { routeComponent } from './route-component'
import { routeData } from './route-data'
import { routeDocs } from './route-docs'
import { routeLayout } from './route-layout'
import { routeMain } from './route-main'
import { routePage } from './route-page'
import { routeParams } from './route-params'
import { routePdf } from './route-pdf'
import { routePublic } from './route-public'
import { routeUpload } from './route-upload'

const ext =
  extServer && (extServer as any).default
    ? (extServer as any).default
    : extServer

declare const global: PlatformGlobal

export const routeInit = (server: ServerInstance) => {
  server.get('/__component/:id', routeComponent)
  server.get('/__page/:id.:ext', routePage)
  server.all('/__docs*', routeDocs)
  server.post('/__params/:id', routeParams)
  server.get('/__layout/:id.:ext', routeLayout)
  server.get('/upload/*', routeUpload)
  server.post('/__upload', routeUpload)
  server.all('/__pdf/:mode/:id', routePdf)
  server.get('/__init*', async (req, reply) => {
    const init = await initPage(req, reply)
    reply.send(serializeJavascript(init))
  })
  server.all('/__data*', async (req, reply) => {
    routeData(req, reply, global.mode, global.pool?.parent)
  })

  const mainRoute = async (req, reply) => {
    let url = req.url.split('?')[0]

    if (await routeAPI({ url, req, reply })) {
      return
    }

    if (await routePublic({ url, req, reply })) {
      return
    }

    if (await routeMain({ url, req, reply })) {
      return
    }
  }
  server.get('*', mainRoute)
  server.post('*', mainRoute)
}

export const initPage = async (req?: FastifyRequest, reply?: FastifyReply) => {
  let url = '/'
  let session = { user: {} }
  if (req && reply) {
    req.url.split('?')[0]
    session = await loadSession(req, reply)
  }
  const cms_pages = global.build.cms_pages
  const cms_layouts = global.build.cms_layouts

  const parsed = await parseParams({
    url,
    req,
    reply,
    cms_layouts,
    user: session.user,
    ext,
  })

  if (parsed) {
    return {
      cli_port: global.port,
      build_id: global.build.id,
      user: JSON.stringify(session.user),
      params: parsed.params,
      cms_id: parsed.cms_id,
      cms_pages,
      cms_layouts,
      inject_css: [],
      assets: global.assets,
      tstamp: global.assetStamp,
      is_dev: global.mode === 'dev',
      secret: global.build.secret,
    }
  }
}

const parseParams = async ({
  url,
  req,
  reply,
  user,
  cms_layouts,
  ext,
}: {
  url: string
  req?: FastifyRequest
  reply?: FastifyReply
  user: any
  cms_layouts: any
  ext: any
}) => {
  const solLog = (...args: any[]) => {
    let output: string[] = []
    for (let i of args) {
      if (typeof i === 'object') {
        output.push(serializeJavascript(i))
      } else {
        output.push(i)
      }
    }
    if (reply) reply.send(output.join('\n'))
  }

  let result = { params: {}, cms_id: '00000' }

  for (let [_, page] of Object.entries(global.cache.page)) {
    if (page && page.url) {
      let matchedParams = matchRoute(url, page.url)
      if (matchedParams) {
        result.params = matchedParams
        result.cms_id = page.id

        const layout = cms_layouts[page.layout_id]
        if (layout) {
          const cachedLayout = global.cache.layout[layout.id]
          if (!layout.source && cachedLayout) {
            const sourceMapUrl = `/__layout/${layout.id}.js.map`
            layout.source =
              cachedLayout.jsx?.code +
              `\n\n//# sourceMappingURL=${sourceMapUrl}`
          }

          const sol = cachedLayout.serverOnLoad
          if (sol) {
            result.params = (await renderParamsLayout(
              ext,
              matchedParams,
              cachedLayout,
              req,
              reply
            )) as any
          }
        }

        if (reply && page.serverOnLoad) {
          await page.serverOnLoad({
            template: null,
            params: result.params,
            render: async (_template, _params) => {
              if (_params) {
                result.params = _params
              }
              reply.type('application/javascript')
              const packer = new global.bin.msgpackr.Packr({})
              reply.send(
                `window.cms_base_pack = ${JSON.stringify(
                  packer.pack(result).toJSON().data
                )}`
              )
            },
            db: global.db,
            req,
            reply,
            user,
            ext,
            api,
            isDev: global.mode === 'dev',
            log: solLog,
          })
          return
        }
      }
    } else {
    }
  }
  return result
}

export const renderParamsLayout = async (
  ext: any,
  params: any,
  layout: Layout,
  req?: FastifyRequest,
  reply?: FastifyReply
) => {
  if (layout && layout.serverOnLoad && req && reply) {
    const session = await loadSession(req, reply)
    return await new Promise(async (resolve) => {
      if (layout && layout.serverOnLoad)
        await layout.serverOnLoad({
          template: null,
          params,
          render: async (_template, _params) => {
            resolve(_params)
          },
          db: global.db,
          req,
          reply,
          user: session,
          ext,
          api,
          isDev: global.mode === 'dev',
          log: console.log,
        })
    })
  }
}
