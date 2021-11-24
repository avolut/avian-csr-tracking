import { Node } from '@babel/types'
import { _figma } from 'web-dev/src/Figma'
import { BaseWindow } from 'web-init/src/window'
import { askFigma } from './ask-figma'
import {
  createFNodeTag,
  fetchFrame,
  fetchNode,
  fetchNodeMap,
  FigmaFrame,
  FigmaNode,
  recursivePrintHtml,
} from './figma-node'
import { FigmaPage } from './figma-page'

import type * as _ from '@figma/plugin-typings'

declare const window: BaseWindow
export class FigmaBase {
  constructor() {
    FigmaPage.loadAllPages().then(async (pages) => {
      _figma.tools.fetchFrame = fetchFrame
      _figma.tools.fetchNode = fetchNode
      _figma.tools.fetchNodeMap = fetchNodeMap
      _figma.tools.recursivePrintHtml = recursivePrintHtml

      await askFigma(
        (x) => {
          figma.on('selectionchange', x.onSelect)
        },
        { onSelect: this.onFrameSelected }
      )


      const frameTree = _figma.current.frame
      if (frameTree && frameTree.error) {
        _figma.current.node = frameTree.error.node
      }
      this.onFrameSelected()
      _figma.current.save = this.executeSave
      console.log(`[FigmaBase] Loaded ${Object.keys(pages).length} pages`)
    })
  }

  async syncHtmlToFigma(
    node: FigmaNode,
    opt: {
      astFigmaNodeMap?: Record<string, Node>
      changeOffset?: number
    }
  ) {
    let current = node
    let pos = {
      start: 0,
      end: Number.MAX_SAFE_INTEGER,
      node_id: node.id,
    }

    let changeOffset = opt?.changeOffset
    let meta_ast = opt?.astFigmaNodeMap
    if (!meta_ast) {
      meta_ast = {}
      // TODO: parse source code, and store the map
      // this is required when meta_ast is not yet parsed,
      //    e.g. when saving from vscode to figma
    }

    if (changeOffset) {
      for (let [node_id, ast] of Object.entries(meta_ast)) {
        if (ast && ast.start && ast.end) {
          if (changeOffset >= ast.start && changeOffset <= ast.end) {
            if (
              (pos.start === 0 && pos.end === Number.MAX_SAFE_INTEGER) ||
              (pos.start <= ast.start && pos.end >= ast.end)
            ) {
              pos.start = ast.start
              pos.end = ast.end
              pos.node_id = node_id
            }
          }
        }
      }
    }

    if (pos.node_id !== node.id) {
      const newnode = getFigmaNodeById(pos.node_id, node)
      if (newnode) {
        current = newnode
      }
    }

    // only sync html to current node
    // skip the children
    if (current) {
      const ast = meta_ast[current.id]
      const childs: string[] = []

      if (ast && ast.type === 'JSXElement' && ast.children.length > 0) {
        // TODO: replace fnode with {children}

        if (window.babel.traverse && window.babel.generate) {
          let childrenGenerated = false
          window.babel.traverse(
            {
              start: ast.start,
              end: ast.end,
              type: 'File',
              program: {
                sourceType: 'module',
                start: ast.start,
                end: ast.end,
                type: 'Program',
                body: ast.children,
              },
            } as any,
            {
              enter: (path) => {
                const c = path.node
                if (c.type === 'JSXElement') {
                  if (
                    c.openingElement.name.type === 'JSXIdentifier' &&
                    c.openingElement.name.name === 'fnode'
                  ) {
                    let id = ''
                    for (let e of c.openingElement.attributes) {
                      if (
                        e.type === 'JSXAttribute' &&
                        e.name.name === 'id' &&
                        e.value?.type === 'StringLiteral'
                      ) {
                        id = e.value.value
                      }
                    }
                    if (id !== current.id) {
                      if (childrenGenerated) {
                        path.remove()
                      } else {
                        childrenGenerated = true
                        path.replaceWithSourceString(`{children}`)
                      }
                    }
                  }
                }
              },
            }
          )

          for (let i of ast.children) {
            childs.push(window.babel.generate(i).code)
          }
        }

        const newraw = [...new Set(childs)].join('')
        current.html.raw = newraw
        current.html.code = createFNodeTag(current, current.html.raw)
        askFigma(
          (x) => {
            const node = figma.getNodeById(x.id)
            if (node) {
              node.setPluginData('f-html', x.html)
            }
          },
          {
            id: current.id,
            html: newraw,
          }
        )
      }
    }
  }

  async executeSave() {
    const current = _figma.current
    const node = current.frame

    current.saving = true
    _figma.main.topbar.render()
    if (node) {
      const nodes = await fetchNodeMap(node.id)

      const babel = window.babel

      if (!window['TextDecoder']) {
        alert('Sorry, this browser does not support TextDecoder...')
        return
      }

      if (node && babel.prettier) {
        let code = babel.prettier(
          `<>${node.html.effect}${recursivePrintHtml(node)}</>`
        )
        const target = node.target

        if (target && target.id) {
          window.ws_dev?.packAndSend({
            type: 'figma-save-frame',
            data: {
              id: target.id,
              code,
              nodes,
            },
          })
        }
      }
    }

    current.saving = false
    _figma.main.topbar.render()
  }

  async onFrameSelected() {
    _figma.main.render()

    const { sels, cpage, nextName } = (await askFigma(() => {
      const sels = figma.currentPage.selection
      let sel = sels[0] as any
      let nextName = ''
      if (sel) {
        while (sel.parent && sel.parent.type !== 'PAGE') {
          sel = sel.parent
        }
        nextName = sel.name
      }

      return {
        sels: sels,
        nextName,
        cpage: figma.currentPage,
      }
    })) as { sels: any[]; cpage: any; nextName }

    _figma.main.render()

    if (
      !_figma.current.page ||
      (_figma.current.page && cpage.id !== _figma.current.page.id)
    ) {
      for (let [id, page] of Object.entries(_figma.cache.pages)) {
        if (id === cpage.id) {
          _figma.current.page = page
        }
      }
    }

    _figma.current.frame = null

    const page = _figma.current.page
    if (page && sels && sels.length > 0) {
      const id = sels[0].id
      const node = await fetchNode(id)

      const reloadFrameTree = async () => {
        if (page.frames[node.frame.id] && page.frames[node.frame.id].html) {
          _figma.current.frame = page.frames[node.frame.id]
        } else {
          _figma.current.frame = await fetchFrame(node.frame.id)

          if (_figma.current.frame.target) {
            _figma.cache.framesByTargetId[_figma.current.frame.target.id] =
              _figma.current.frame
          }

          page.frames[node.frame.id] = _figma.current.frame
        }
      }

      if (node.frame && node.frame.id) {
        const frame = _figma.current.frame as null | FigmaFrame
        if (frame !== null && frame.id !== node.frame.id) {
          await reloadFrameTree()
        }
      }

      if (_figma.current.frame) {
        const nodeInTree = getFigmaNodeById(node.id, _figma.current.frame)
        if (nodeInTree) {
          for (let [k, v] of Object.entries(node)) {
            if (k !== 'children') nodeInTree[k] = v
          }
          _figma.current.node = nodeInTree
        }
      }
    }

    _figma.main.render()
  }

  static init() {
    if (!_figma.cache.base) {
      _figma.cache.base = new FigmaBase()
    }
  }
}

export const getFigmaNodeById = (
  id: string,
  cur: FigmaNode
): FigmaNode | null => {
  for (let i of cur.children) {
    let result = getFigmaNodeById(id, i)
    if (result) {
      return result
    }
  }
  if (cur.id === id) return cur as FigmaNode
  return null
}
