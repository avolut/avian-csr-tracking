import { transformAsync, TransformOptions } from '@babel/core'
import generate from '@babel/generator'
import { parse } from '@babel/parser'
import traverse from '@babel/traverse'
import { JSXElement } from '@babel/types'
import { log } from 'boot'
import get from 'lodash.get'
import { Layout, Page } from 'platform/src/types'

export const compileSinglePage = async (
  id: string,
  jsx: string,
  type: string,
  modernBrowser: boolean = false
) => {
  const transformOpt: TransformOptions = {
    minified: true,
    sourceMaps: true,
    comments: false,
    presets: [
      [
        '@babel/preset-react',
        {
          pragma: 'h',
          pragmaFrag: 'fragment',
        },
      ],
      [
        '@babel/env',
        {
          targets: {
            browsers: [modernBrowser ? 'defaults' : 'Chrome <= 45'],
          },
          useBuiltIns: 'entry',
          corejs: { version: '3.8', proposals: true },
        },
      ],
      [
        '@babel/preset-typescript',
        {
          isTSX: true,
          allExtensions: true,
          jsxPragma: 'h',
          jsxPragmaFrag: 'fragment',
          allowNamespaces: true,
        },
      ],
    ],
  }

  const result = await transformAsync(
    `${jsx.replace(/<!--([\s\S])*?-->/g, '')}`,
    transformOpt
  )

  if (result && result.code && result.map) {
    let code = result.code
    if (result.code.startsWith('"use strict";')) {
      code = result.code.substr('"use strict";'.length)
    }

    result.map.sources[0] = `/__${type}/${id}.js`
    return {
      raw: jsx,
      code: code,
      map: JSON.stringify(result.map),
    }
  }
}

// extract meta and remove fnode
// also replace figma-react-elements (__.)
export const preProcessJSX = (page: Page | Layout, code: string) => {
  const parsed = parse(code, {
    sourceType: 'module',
    plugins: ['jsx', 'typescript'],
  })
  let meta = ''

  const figmaReactElements: Record<string, { raw: string; ast: any }> = {}

  const isLayout = !(page as any).layout_id

  traverse(parsed, {
    enter: (path) => {
      const c = path.node
      if (
        c.type === 'JSXElement' &&
        c.openingElement.name.type === 'JSXIdentifier'
      ) {
        if (c.openingElement.name.name === 'figma-react-elements') {
          const attr = get(c, 'openingElement.attributes.0.value')
          const source = code.substr(attr.start + 1, attr.end - attr.start - 2)
          const output = { result: {} }
          new Function(`this.result = ${source}`).bind(output)()
          for (let [k, v] of Object.entries(output.result)) {
            figmaReactElements[k] = { raw: v as string, ast: null }
          }
          path.remove()
        }

        if (isLayout && c.openingElement.name.name === 'fnode') {
          for (let attr of c.openingElement.attributes) {
            if (
              attr.type === 'JSXAttribute' &&
              attr.name.type === 'JSXIdentifier' &&
              attr.name.name === 'name' &&
              attr.value &&
              attr.value.type === 'StringLiteral' &&
              attr.value.value === 'children'
            ) {
              path.replaceWithSourceString('{children}')
            }
          }
        }

        if (c.openingElement.name.name !== 'fnode') {
          const parent = path.findParent(
            (p) =>
              p.node.type === 'JSXElement' &&
              p.node.openingElement.name.type === 'JSXIdentifier' &&
              p.node.openingElement.name.name === 'fnode'
          )

          if (parent) {
            const props = { class: '', style: '' }
            for (let a of (parent.node as JSXElement).openingElement
              .attributes) {
              if (
                a.type === 'JSXAttribute' &&
                a.name.type === 'JSXIdentifier' &&
                a.value &&
                a.value.start &&
                a.value.end
              ) {
                const name = a.name.name

                if (name === 'style' || name === 'class') {
                  const value = code.substr(
                    a.value.start + 2,
                    a.value.end - a.value.start - 4
                  )
                  props[name] = value
                }
              }
            }

            for (let a of c.openingElement.attributes) {
              if (
                a.type === 'JSXAttribute' &&
                a.name.type === 'JSXIdentifier' &&
                a.value &&
                a.value.start &&
                a.value.end
              ) {
                const name = a.name.name
                if (name === 'style' || name === 'class') {
                  const value = code.substr(
                    a.value.start,
                    a.value.end - a.value.start
                  )

                  const parsed = parse(
                    `<div attr=${value.replace(`[${name}]`, props[name])} />`,
                    {
                      sourceType: 'module',
                      plugins: ['jsx', 'typescript'],
                    }
                  )

                  a.value = get(
                    parsed,
                    'program.body.0.expression.openingElement.attributes.0.value'
                  )
                }
              }
            }
          }
        }
      }
    },
  })

  traverse(parsed, {
    MemberExpression: (path) => {
      if (
        path.node.object &&
        path.node.object.type === 'Identifier' &&
        path.node.property.type === 'Identifier' &&
        path.node.object.name === '__'
      ) {
        const name = `__.${path.node.property.name}`

        if (figmaReactElements[name]) {
          if (!figmaReactElements[name].ast) {
            try {
              const parsed = parse(`<>{${figmaReactElements[name].raw}}</>`, {
                sourceType: 'module',
                plugins: ['jsx', 'typescript'],
              })

              figmaReactElements[name].ast = get(
                parsed,
                'program.body.0.expression.children.0.expression'
              )
              if (!figmaReactElements[name].ast) {
                figmaReactElements[name].ast = get(
                  parsed,
                  'program.body.0.expression'
                )
              }
            } catch (e) {
              try {
                const parsed = parse(`<>${figmaReactElements[name].raw}</>`, {
                  sourceType: 'module',
                  plugins: ['jsx', 'typescript'],
                })

                figmaReactElements[name].ast = get(
                  parsed,
                  'program.body.0.expression.children.0.expression'
                )
                if (!figmaReactElements[name].ast) {
                  figmaReactElements[name].ast = get(
                    parsed,
                    'program.body.0.expression'
                  )
                }
              } catch (e) {
                process.stdout.write('\n')
                log(
                  'error',
                  `ERROR: app/web/src/base/page/${page.id}.base.tsx | ${page.name}`
                )
                log('error', `${e} \n<>${figmaReactElements[name].raw}</>`)
              }
            }
          }

          path.replaceWith(figmaReactElements[name].ast)
        }
      }
    },
    enter: (path) => {
      const c = path.node

      if (
        c.type === 'CallExpression' &&
        c.callee.type === 'Identifier' &&
        c.callee.name === 'base' 
      ) {
        const arg = c.arguments[0]
        if (arg.type === 'ObjectExpression') {
          for (let prop of arg.properties) {
            if (
              prop.type === 'ObjectProperty' &&
              prop.key.type === 'Identifier' &&
              prop.key.name === 'meta'
            ) {
              const val = prop.value
              if (val.start && val.end) {
                meta = code.substring(val.start, val.end)
              }
            }
          }
        }
      }

      if (
        c.type === 'JSXElement' &&
        c.openingElement.name.type === 'JSXIdentifier'
      ) {
        switch (c.openingElement.name.name) {
          case 'fnode':
            {
              const filteredChildren = c.children.filter((e) => {
                if (e.type === 'JSXText') {
                  return e.value.trim()
                }
                return true
              })

              if (filteredChildren.length === 1) {
                path.replaceWith(filteredChildren[0])
              }
            }
            break
        }
      }
    },
  })

  return { meta: meta || '{}', code: generate(parsed).code }
}
