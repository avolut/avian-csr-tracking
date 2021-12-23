import { dirs } from 'boot'
import { generate, NodePath, parse, template, traverse } from 'libs/babel'
import { readFile, writeFile } from 'libs/fs'
import { join } from 'path'

export const genTypeGlobal = async () => {
  const globalSource = await readFile(
    join(dirs.app.web, 'src', 'global.ts'),
    'utf-8'
  )

  const exported: Record<string, true> = {}

  traverse(
    parse(globalSource, {
      sourceType: 'module',
      plugins: ['jsx', 'typescript'],
    }),
    {
      enter: (path) => {
        const c = path.node
        if (c.start && c.end) {
          if (c.type.toLowerCase().indexOf('export') >= 0) {
            if (c.type === 'ExportNamedDeclaration') {
              if (
                c.declaration &&
                c.declaration.type === 'VariableDeclaration'
              ) {
                for (let d of c.declaration.declarations) {
                  if (d.id.type === 'Identifier') {
                    exported[d.id.name] = true
                  }
                }
              }
            }
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

  const usage = Object.keys(exported)
  traverse(parsed, {
    Program: (program) => {
      root = program
    },
    enter: (path) => {
      const c = path.node
      if (c.start && c.end) {
        if (
          c.type === 'VariableDeclaration' &&
          c.declarations[0].type === 'VariableDeclarator' &&
          c.declarations[0].id.type === 'Identifier' &&
          exported[c.declarations[0].id.name]
        ) {
          path.remove()
        }
        if (
          c.type === 'ImportDeclaration' &&
          c.source.value === './src/global'
        ) {
          let importDeclarations = template(
            `import * as __glb from './src/global'`
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
          c.type === 'TSModuleDeclaration' &&
          c.id.type === 'Identifier' &&
          c.id.name === 'global' &&
          c.body.type === 'TSModuleBlock'
        ) {
          for (let e of usage) {
            const res = template(`const ${e}: typeof __glb.${e};`, {
              sourceType: 'module',
              plugins: ['jsx', 'typescript'],
            })()
            if (Array.isArray(res)) {
              c.body.body.unshift(res[0])
            } else {
              c.body.body.unshift(res)
            }
          }
        }
      }
    },
  })

  await writeFile(join(dirs.app.web, 'base.d.ts'), generate(parsed).code)
}
