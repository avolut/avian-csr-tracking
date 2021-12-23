import { dirs } from 'boot'
import { generate, parse, traverse } from 'libs/babel'
import trim from 'lodash.trim'
import { join } from 'path/posix'

export const templateDir = join(dirs.app.web, 'cms', 'templates')

export const baseDir = {
  layout: join(dirs.app.web, 'src', 'base', 'layout'),
  api: join(dirs.app.web, 'src', 'base', 'api'),
  page: join(dirs.app.web, 'src', 'base', 'page'),
}

export const parseFigmaJSX = async (existing: string) => {
  const parsed = parse(existing, {
    sourceType: 'module',
    plugins: ['jsx', 'typescript'],
  })

  let effect = ''
  let html = ''

  traverse(parsed, {
    enter: (path) => {
      const c = path.node
      if (
        c.type === 'JSXElement' &&
        c.openingElement.name.type === 'JSXIdentifier' &&
        c.start &&
        c.end
      ) {
        if (c.openingElement.name.name === 'effect') {
          effect = existing.substr(c.start, c.end - c.start)
          path.remove()
        }
        if (c.openingElement.name.name === 'figma-react-elements') {
          path.remove()
        }
      }
    },
  })

  html = trim(generate(parsed, {}).code, ';')
  if (html.startsWith('<>') && html.endsWith('</>')) {
    html = html.substr('<>'.length, html.length - '<></>'.length)
  }

  return {
    html,
    effect,
    fre: {},
  }
}
