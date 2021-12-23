import { pathExists, readFile, writeFile } from 'libs/fs'
import { join } from 'path'
import { dirs } from 'boot'
import { traverse } from 'libs/babel'
import { parse } from 'libs/babel'
import * as __db from 'db'

export const checkBaseType = async () => {
  const baseTypePath = join(dirs.app.web, 'base.d.ts')
  if (
    !(await pathExists(baseTypePath)) ||
    (await (await readFile(baseTypePath, 'utf-8')).trim()) === ''
  ) {
    await writeFile(
      baseTypePath,
      `\
export {}
import {} from './src/external'
import {} from './src/global'
import * as __db from '../db'
import * as __emotion_react from '@emotion/react'
import * as __utils_api from 'web-utils/src/api'
import { ReactElement } from 'react'
import * as __waitUntil from '../../pkgs/libs/src/wait-until'
import { BaseWindow } from 'web-init/src/window'

type ExtractProps<T extends (args?: any) => any> =
  Parameters<T>[0] extends undefined ? {} : Parameters<T>[0]

declare global {
    const css: typeof __emotion_react.css
    const api: typeof __utils_api.api
    const waitUntil: typeof __waitUntil
    const db: typeof __db.db & { query: (sql: string) => Promise<any[]> }
    const params: any
  
    function ssr(arg: {
      update: { mode: 'auto' | 'manual' }
      render: (arg: {
        html: (...text: any[]) => string
        window: BaseWindow & Window & typeof __glb
      }) => {}
      css: string[]
    })
    
    function base<T extends Record<string, any>>(
      effect: {
        meta: () => T
        mobx?: boolean
        init?: (args: {
          meta: T
          children?: any
          window: BaseWindow & Window & typeof  __glb
          render: () => void
          layout?: { meta: any; render: () => void }
        }) => any | Promise<any>
      },
      content: (
        args: {
          meta: T
          window: BaseWindow & Window & typeof __glb
          layout?: { meta: any; render: () => void }
          children?: any
          render: () => void
        },
        props?: any
      ) => ReactElement,
      props?: any
    ): void

    function runInAction(func: () => void): void
    function action<T>(func: T): T

    namespace JSX {
        interface IntrinsicElements {
        effect: any
        }
    }
    namespace React {
        interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
          class?: string | null | number | boolean
          style?: any
        }
    }
}`
    )
  }

  const source = await readFile(baseTypePath, 'utf-8')

  const parsed = parse(source, {
    sourceType: 'module',
    plugins: ['jsx', 'typescript'],
  })

  let result = false
  traverse(parsed, {
    enter: (path) => {
      const c = path.node
      if (c.start && c.end) {
        if (
          c.type === 'TSModuleDeclaration' &&
          c.id.type === 'Identifier' &&
          c.id.name === 'global' &&
          c.body.type === 'TSModuleBlock' &&
          c.body.body.length < 5
        ) {
          result = true
        }
        if (c.type === 'TSInterfaceBody' && c.body.length <= 1) {
          result = true
        }
      }
    },
  })

  return result
}
