import { template } from '@babel/core'
import generate from '@babel/generator'
import { parse } from '@babel/parser'
import traverse, { NodePath } from '@babel/traverse'
import { dirs } from 'boot'
import { readFile, writeFile } from 'fs-extra'
import get from 'lodash.get'
import { join } from 'path'

export const genTypeExternal = async () => {
  const externalSource = await readFile(
    join(dirs.app.web, 'src', 'external.tsx'),
    'utf-8'
  )

  const exported: Record<string, string> = {}

  traverse(
    parse(externalSource, {
      sourceType: 'module',
      plugins: ['jsx', 'typescript'],
    }),
    {
      enter: (path) => {
        const c = path.node
        if (c.start && c.end) {
          if (c.type === 'ObjectProperty') {
            let name = ''
            let from = ''
            if (c.key.type === 'StringLiteral') {
              name = c.key.value
            } else if (c.key.type === 'Identifier') {
              name = c.key.name
            }

            from = get(c.value, 'body.elements.0.arguments.0.value')

            exported[name] = from
          }
        }
      },
    }
  )

  traverse(
    parse(
      await readFile(
        join(dirs.pkgs.web, 'init', 'src', 'mobile', 'mobile-ext.tsx'),
        'utf-8'
      ),
      {
        sourceType: 'module',
        plugins: ['jsx', 'typescript'],
      }
    ),
    {
      enter: (path) => {
        const c = path.node
        if (c.start && c.end) {
          if (c.type === 'ObjectProperty') {
            let name = ''
            let from = ''
            if (c.key.type === 'StringLiteral') {
              name = c.key.value
            } else if (c.key.type === 'Identifier') {
              name = c.key.name
            }

            from = get(c.value, 'body.elements.0.arguments.0.value')

            exported[name] = from.replace('../../../', '../../pkgs/web/')
          }
        }
      },
    }
  )

  const source = await readFile(join(dirs.app.web, 'base.d.ts'), 'utf-8')
  let root = null as null | NodePath
  const parsed = parse(source, {
    sourceType: 'module',
    plugins: ['jsx', 'typescript'],
  })

  traverse(parsed, {
    Program: (program) => {
      root = program
    },
    enter: (path) => {
      const c = path.node
      if (c.start && c.end) {
        // if (
        //   c.type === 'VariableDeclaration' &&
        //   c.declarations.length === 1 &&
        //   c.declarations[0].type === 'VariableDeclarator' &&
        //   c.declarations[0].id.type === 'Identifier' &&
        //   exported[c.declarations[0].id.name]
        // ) {
        //   path.remove()
        // }
        if (
          c.type === 'ImportDeclaration' &&
          c.source.value === './src/external'
        ) {
          let importDeclarations = template(
            Object.entries(exported)
              .map(
                ([name, from]) =>
                  `import __${name.replace(/\W/g, '_')} from '${
                    from.startsWith('./') ? './src/' + from.substring(2) : from
                  }'`
              )
              .join('\n')
          )()

          path.insertAfter(importDeclarations)
          path.remove()
        }
      }
    },
  })
  traverse(parsed, {
    Program: (program) => {
      root = program
    },
    enter: (path) => {
      const c = path.node
      if (c.start && c.end) {
        if (
          c.type === 'TSInterfaceDeclaration' &&
          c.id.type === 'Identifier' &&
          c.id.name === 'IntrinsicElements'
        ) {
          const res = template(
            `
              interface IntrinsicElements {
                  effect: any;
                  ${Object.entries(exported)
                    .map(
                      ([name, from]) =>
                        `"${name}": ExtractProps<typeof __${name.replace(
                          /\W/g,
                          '_'
                        )}>;`
                    )
                    .join('\n')}
              }`,
            {
              sourceType: 'module',
              plugins: ['jsx', 'typescript'],
            }
          )()

          path.insertAfter(res)

          path.remove()
        }
      }
    },
  })

  await writeFile(join(dirs.app.web, 'base.d.ts'), generate(parsed).code)
}
