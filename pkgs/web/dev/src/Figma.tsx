/** @jsx jsx */
import type { Position } from 'monaco-editor'
import { BaseWindow } from 'web-init/src/window'
import { FigmaBase } from './figma/figma-base'
import { FigmaFrame, FigmaNode } from './figma/figma-node'
import { FigmaPage } from './figma/figma-page'
declare const window: BaseWindow

export const _figma = {
  current: {
    page: null as null | FigmaPage,
    node: null as null | FigmaNode,
    frame: null as null | FigmaFrame,
    saving: false,
    save: async () => {}
  },
  tools: {
    fetchNodeMap: (id: string): Promise<Record<string, any>> => ({} as any),
    recursivePrintHtml: (node: FigmaNode): string => '',
    fetchNode: (id: string, useCache: boolean = true): Promise<FigmaNode> =>
      ({} as any),
    fetchFrame: (id: string, useCache: boolean = true): Promise<FigmaFrame> =>
      ({} as any),
  },
  main: {
    init: false,
    connected: false,
    render: () => {},
    topbar: {
      zoom: 100,
      render: () => {},
    },
    resizer: {
      render: () => {},
    },
  },
  cache: {
    pages: {} as Record<string, FigmaPage>,
    framesByTargetId: {} as Record<string, FigmaFrame>,
    base: null as null | FigmaBase,
  },
}
