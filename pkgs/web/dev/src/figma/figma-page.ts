import { _figma } from 'web-dev/src/Figma'
import { askFigma } from './ask-figma'
import { FigmaFrame } from './figma-node'
export class FigmaPage {
  frames: Record<string, FigmaFrame> = {}
  id: string

  constructor(id: string) {
    this.id = id
  }
  async init() {
    const raw = (await askFigma(
      (x) => {
        const page: PageNode = figma.getNodeById(x.id) as any
        const result = {}
        if (page) {
          for (let frame of page.children) {
            result[frame.id] = {
              id: frame.id,
              target: JSON.parse(frame.getPluginData('target') || '{}'),
            }
          }
        }
        return result
      },
      { id: this.id }
    )) as Record<string, { id: string; target: FigmaFrame['target'] }>

    for (let i of Object.keys(this.frames)) {
      delete this.frames[i]
    }

    for (let [k, v] of Object.entries(raw)) {
      this.frames[k] = v as any
      _figma.cache.framesByTargetId[v.target.id] = this.frames[k]
    }
  }

  static async loadAllPages() {
    const raw = (await askFigma(() => figma.root.children)) as {
      id: string
    }[]

    const result: Record<string, FigmaPage> = {}
    for (let i of raw) {
      result[i.id] = new FigmaPage(i.id)
      await result[i.id].init()
    }

    _figma.cache.pages = result

    return result
  }
}
