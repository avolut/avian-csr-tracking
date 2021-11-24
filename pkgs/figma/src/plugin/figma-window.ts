import { removeCircular } from 'web-utils/src/removeCircular'
import { FigmaFrame, FigmaNode } from '../../../web/dev/src/figma/figma-node'
import { buildTwClassStyle } from './builder/figma-builder'

export const defineFigmaWindow = () => {
  const fwindow = {
    getBaseNode(id: string, opt?: { withoutChildren?: boolean }): FigmaNode {
      const node = figma.getNodeById(id)
      if (!node) return null

      let parent = null
      let frame = null
      let page = null

      let current = node
      while (current && current.parent) {
        if (parent === null) parent = current.parent
        if (current.parent.type === 'PAGE') {
          frame =
            current === parent
              ? JSON.parse(JSON.stringify(current, removeCircular()))
              : current
          page = current.parent
          break
        }
        current = current.parent
      }

      const { legacy, text, raw, effect, error, props, tagName, raster } =
        decorateNode(node)

      const children = []
      if (opt?.withoutChildren !== true) {
        if ((node as any).children) {
          for (let i of (node as any).children) {
            children.push(i)
          }
        }
      }

      const result: FigmaNode | FigmaFrame = {
        id,
        name: node.name,
        figmaType: node.type,
        text,
        html: {
          raw,
          effect,
          code: '',
          dirty: false,
        },
        legacy,
        error,
        tag: { ...buildTwClassStyle(node), name: tagName, props, raster },
        frame: { id: frame.id } as any,
        page: { id: page.id } as any,
        parent: parent === node ? undefined : parent,
        children,
      }
      return result
    },
    getBaseNodeTree(
      id: string | SceneNode,
      parent?: FigmaNode,
      opt?: { figmaReactElements: Record<string, any>; root: FigmaFrame }
    ): FigmaNode | null {
      const node = typeof id === 'string' ? figma.getNodeById(id) : id
      if (!node) return null

      let frame = opt && opt.root ? opt.root : ({ id } as any)
      let page = null
      let children = []
      const {
        legacy,
        text,
        raw,
        effect,
        error,
        target,
        tagName,
        props,
        raster,
      } = decorateNode(node)

      if (node.parent && node.parent.type === 'PAGE') {
        page = node.parent
      }

      let fre = {}
      if (opt && opt.figmaReactElements) {
        fre = opt.figmaReactElements
      }

      if (node.name.startsWith('__.')) {
        fre[node.name] = fwindow.getBaseNode(node.id, { withoutChildren: true })
      }

      const result: FigmaNode | FigmaFrame = {
        id: node.id,
        name: node.name,
        figmaType: node.type,
        figmaReactElements: undefined,
        text,
        html: {
          raw,
          effect,
          code: '',
          dirty: false,
        },
        legacy,
        error,
        tag: { ...buildTwClassStyle(node), name: tagName, props, raster },
        frame: { id: frame.id } as any,
        target,
        page,
        parent: parent || null,
        children,
      }

      if ((node as any).children && tagName !== 'img') {
        for (let i of (node as any).children) {
          children.push(
            fwindow.getBaseNodeTree(i.id, result, {
              root: frame,
              figmaReactElements: fre,
            })
          )
        }
      }

      if (!opt) {
        result.figmaReactElements = fre
      }

      return result
    },
  }

  return fwindow
}

const decorateNode = (node: BaseNode) => {
  const legacy = {
    wrapCode: node.getPluginData('wrapCode'),
  }

  let text
  if (node.type === 'TEXT') {
    text = node.characters
  } else if (node.type === 'INSTANCE') {
    const children = node.findOne((e) => e.name.toLowerCase() === 'children')
    if (children && children.type === 'TEXT') {
      text = children.characters
    }
  }

  const target = JSON.parse(node.getPluginData('target') || '{}')

  let raw = node.getPluginData('f-html') || ''
  let props = []
  const rawprops = JSON.parse(node.getPluginData('props') || '{}') as Record<
    string,
    string
  >

  let children = ''
  for (let [name, value] of Object.entries(rawprops)) {
    if (name === 'children') {
      children = value
      continue
    }
    if (value) {
      if (value.startsWith('{`') && value.endsWith('`}')) {
        props.push(`${name}={\`${value.substr(2, value.length - 4).trim()}\`}`)
      } else {
        props.push(`${name}=${value.trim()}`)
      }
    }
  }
  let tagName = node.getPluginData('tagName')
  const raster = node.getPluginData('raster') || ''

  if (node.type === 'INSTANCE' && !raw.trim()) {
    tagName = target.name || 'div'

    if (children) {
      raw = `<${tagName} ${props.join('')}>${children}</${tagName}>`
    } else {
      raw = `<${tagName} ${props.join('')}/>`
    }
  }

  let effect = ''
  if (node.parent && node.parent.type === 'PAGE') {
    effect =
      node.getPluginData('effect') ||
      '<effect meta={{}} run={async () => {}} />'
  }

  let error: any = node.getPluginData('f-error') || undefined
  if (error) {
    error = JSON.stringify(error)
  }

  return {
    legacy,
    text,
    raw,
    effect,
    error,
    tagName,
    target,
    raster,
    props,
  }
}
