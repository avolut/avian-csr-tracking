import { pathExists, readFile, writeFile } from 'fs-extra'
import { join } from 'path'
import { dirs } from 'boot'
import traverse from '@babel/traverse'
import { parse } from '@babel/parser'
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
import * as __emotion_react from '@emotion/react'
import * as __utils_api from 'web-utils/src/api'
import { ReactElement } from 'react'

type ExtractProps<T extends (args?: any) => any> =
  Parameters<T>[0] extends undefined ? {} : Parameters<T>[0]

declare global {
    const css: typeof __emotion_react.css
    const api: typeof __utils_api.api
    const db: typeof __db.db
    function base<T extends Record<string, any>>(
        effect: {
        meta: T
        init?: (args: {
            meta: T & { render: () => void }
            children?: any
        }) => void | Promise<void>
        },
        content: (args: {
        meta: T & { render: () => void }
        children?: any
        }) => ReactElement
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
