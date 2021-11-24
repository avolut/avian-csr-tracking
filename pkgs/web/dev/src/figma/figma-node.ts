import { _figma } from 'web-dev/src/Figma'
import { BaseWindow } from 'web-init/src/window'
import { askFigma } from './ask-figma'
import { FigmaPage } from './figma-page'

export type FigmaNode = {
  id: string
  name: string
  text?: string
  figmaType: BaseNode['type']
  html: {
    raw: string
    code: string
    effect?: string

    // html is dirty when:
    //  - the text changes is not yet applied to figma
    dirty: boolean
  }
  legacy?: {
    wrapCode: string
  }
  tag: {
    name: string
    class: string
    style: string
    props: string[]
    raster: string
  }
  frame: FigmaNode
  page: FigmaPage
  parent?: string | FigmaNode
  children: FigmaNode[]
}

export type FigmaFrame = FigmaNode & {
  error: null | {
    node: FigmaNode
    code: string
    msg: string
    loc: { column: number; line: number }
  }
  figmaReactElements: Record<string, FigmaNode>
  target: { id: string; type: string; name: string }
}

declare const window: BaseWindow

const template = {
  default: `<[[tagName]] class={\`[class]\`} style={\`[style]\`} [[props]]>{children}</[[tagName]]>`,
  nochild: `<[[tagName]] class={\`[class]\`} style={\`[style]\`} [[props]]/>`,
}

export type fetchNodeOpt = {
  renderChild: boolean
  node?: FigmaFrame
}

export const fetchFrame = async (id: string, useCache: boolean = true) => {
  const node = (await askFigma((x) => x.window.getBaseNodeTree(x.id), {
    id,
  })) as FigmaFrame
  if (!node) return node

  const page = _figma.cache.pages[node.page.id]
  if (page) {
    node.page = page
  }

  if (
    page &&
    page.frames &&
    page.frames[node.id] &&
    !page.frames[node.id].figmaReactElements
  ) {
    page.frames[node.id] = node

    if (_figma.current.frame && _figma.current.frame.id === node.id) {
      _figma.current.frame = node
    }
  }

  return fetchFrameByNode(node, useCache)
}

export const fetchFrameByNode = async (
  node: FigmaFrame,
  useCache: boolean = true
) => {
  const genHtml = async (node: FigmaNode) => {
    await generatePrintedHtml(node, useCache)
  }

  const walkTree = async (node: FigmaNode) => {
    for (let child of node.children) {
      await genHtml(child)
      if (child.children) {
        await walkTree(child)
      }
    }
  }
  await genHtml(node)
  await walkTree(node)
  return node
}

export const fetchNode = async (
  id: string,
  useCache: boolean = true
): Promise<FigmaNode> => {
  const node = (await askFigma((x) => x.window.getBaseNode(x.id), {
    id,
  })) as FigmaNode
  if (!node) return node

  if (node.frame) {
    for (let f of Object.values(_figma.cache.framesByTargetId)) {
      if (f.id === node.frame.id) {
        node.frame = f
      }
    }
  }

  await generatePrintedHtml(node, useCache)

  return node
}

export const createFNodeTag = (node: FigmaNode, children: string) => {
  const className = node.tag.class.trim()
    ? ` class={\`${node.tag.class.trim()}\`}`
    : ''
  const style = node.tag.style.trim()
    ? ` style={\`${node.tag.style.trim()}\`}`
    : ''

  let formattedChildren = children

  if (node.name.startsWith('__.') && formattedChildren[0] === '(') {
    formattedChildren = `{${children}}`
  }

  return `<fnode name="${node.name}" id="${node.id}"${className}${style}>${formattedChildren}</fnode>`
}

export const recursivePrintHtml = (
  node: FigmaNode | FigmaFrame,
  opt?: {
    figmaReactElements?: boolean
  }
) => {
  let html = node.html.code

  let childs: string[] = []
  for (let child of node.children) {
    childs.push(recursivePrintHtml(child, opt))
  }

  const result = html.replace(
    /\{\s*children\s*\}/,
    childs.join('\n') || '{/*children*/}'
  )

  const frame = node as FigmaFrame
  if (frame.figmaReactElements && opt?.figmaReactElements !== false) {
    const fre = {}
    for (let el of Object.values(frame.figmaReactElements)) {
      if (!el.html.code) {
        el.html.code = internalGenerateHTML(el)
      }
      fre[el.name] = el.html.code
    }
    return `<figma-react-elements elements={${JSON.stringify(fre)}}/>${result}`
  }

  return result
}

const generatePrintedHtml = async (
  node: FigmaNode | FigmaFrame,
  useCache: boolean = true
) => {
  if (node.html.raw && useCache) {
    node.html.code = createFNodeTag(node, node.html.raw)
    return
  }

  // if raw html is not yet created
  let html = internalGenerateHTML(node)
  // for (let page of Object.values(_figma.cache.pages)) {
  //   for (let [frameId, frame] of Object.entries(page.frames)) {
  //     if (frameId === node.frame.id && frame.figmaReactElements) {
  //       for (let [freName, freNode] of Object.entries(
  //         frame.figmaReactElements
  //       )) {
  //         if (!freNode.html.code) {
  //           freNode.html.code = internalGenerateHTML(freNode)
  //         }

  //         if (html.indexOf(freName) >= 0) {
  //           html = html.replaceAll(freName, freNode.html.code)
  //           console.log(html)
  //         }
  //       }
  //       break
  //     }
  //   }
  // }
  node.html.raw = html
  node.html.code = createFNodeTag(node, node.html.raw)
  askFigma(
    (x) => {
      const node = figma.getNodeById(x.id)
      if (node) {
        node.setPluginData('f-html', x.html)
      }
    },
    { id: node.id, html: html }
  )
}

const internalGenerateHTML = (node: FigmaNode) => {
  let html = template.nochild
  if (node.figmaType === 'INSTANCE') {
    if (node.text) {
      html = template.default
    }
  } else if (node.text || (node.children && node.children.length > 0)) {
    html = template.default
  }

  if (node.tag.raster) {
    html = `<img class={\`[class]\`} style={\`[style]\`} [[props]]/>`

    let found = false
    for (let [i, v] of Object.entries(node.tag.props)) {
      if (v.startsWith('src=')) {
        node.tag.props[i] = `src="${getSrcFromRaster(
          node.tag.raster,
          node.id
        )}"`
        found = true
      }
    }

    if (!found) {
      node.tag.props.push(`src="${getSrcFromRaster(node.tag.raster, node.id)}"`)
    }
  }

  html = html.replaceAll('[[tagName]]', node.tag.name || 'div')
  html = html.replace(
    '[[props]]',
    ' ' +
      node.tag.props
        .filter((e) => !e.startsWith('class=') && !e.startsWith('style'))
        .join(' ') || ''
  )

  for (let i of node.tag.props) {
    if (i.startsWith('class=')) {
      html = html.replace(`class={\`[class]\`}`, i)
    } else if (i.startsWith('style=')) {
      html = html.replace(`style={\`[style]\`}`, i)
    }
  }

  if (node.text) {
    html = html.replace('{children}', node.text)
  }

  if (node.legacy?.wrapCode) {
    html = node.legacy.wrapCode.replace('<<component>>', html)
  }
  return html
}

export const fetchNodeMap = async (
  root_node_id: string
): Promise<Record<string, any>> => {
  return (await askFigma(
    (x) => {
      const nodes: Record<string, any> = {}
      const getNodeInfo = (node_id: string) => {
        const node = figma.getNodeById(node_id)
        if (node) {
          const props: any = {}
          for (let [k, v] of Object.entries(node)) {
            if (typeof v !== 'function' && typeof v !== 'object') {
              props[k] = v
            }
          }

          for (let k of Object.keys((node as any).__proto__)) {
            if (['horizontalPadding', 'verticalPadding'].indexOf(k) >= 0)
              continue
            props[k] = node[k]
          }

          props._pluginData = {} as any
          ;['f-html', 'target', 'effect'].forEach((e) => {
            props._pluginData[e] = node.getPluginData(e)
          })

          nodes[node_id] = props

          const nodeChildrens: any = (node as any).children
          if (Array.isArray(nodeChildrens)) {
            for (let i of nodeChildrens) {
              getNodeInfo(i.id)
            }
          }
        }
      }

      getNodeInfo(x.id)
      return nodes
    },
    { id: root_node_id }
  )) as any
}

// const generateRealHTML = (node: FigmaNode) => {
//   const html = node.html.printed

//   const babel = window.babel
//   if (babel && babel.parse && babel.traverse && babel.generate) {
//     const parsed = babel.parse(html, {
//       sourceType: 'module',
//       plugins: ['jsx', 'typescript'],
//     })

//     babel.traverse(parsed, {
//       enter: (path) => {
//         if (!babel.generate || !babel.parse) return
//         const c = path.node
//         if (
//           c.type === 'JSXElement' &&
//           c.openingElement.name.type === 'JSXIdentifier'
//         ) {
//           for (let a of c.openingElement.attributes) {
//             if (
//               a.type === 'JSXAttribute' &&
//               a.name.type === 'JSXIdentifier' &&
//               a.value
//             ) {
//               if (a.name.name === 'class' || a.name.name === 'style') {
//                 let value = babel.generate(a.value, {}).code

//                 if (a.name.name === 'class') {
//                   value = value.replace('[class]', node.tag.class.trim())
//                 } else if (a.name.name === 'style') {
//                   value = value.replace('[style]', node.tag.style.trim())
//                 }

//                 const result = babel.parse(value, {
//                   sourceType: 'module',
//                   plugins: ['jsx', 'typescript'],
//                 })

//                 if (a.value.type === 'JSXExpressionContainer') {
//                   a.value.expression = get(
//                     result,
//                     'program.body.0.body.0.expression'
//                   )
//                 }
//               }
//             }
//           }
//         }
//       },
//     })

//     node.html.saved = `${babel.generate(parsed, {}).code}`
//   }
// }

const getSrcFromRaster = (raster: string, id: string) => {
  let size = raster.split('@')[1] || '1'
  let format = raster.split('@')[0]

  return `/fimgs/${id.replace(/\W+/g, '_')}.x${size}.${format.toLowerCase()}`
}
