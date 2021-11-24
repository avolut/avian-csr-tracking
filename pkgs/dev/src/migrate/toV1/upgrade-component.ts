import { traverse } from '@babel/core'
import generate from '@babel/generator'
import { parse } from '@babel/parser'
import template from '@babel/template'
import { NodePath } from '@babel/traverse'
import { Program } from '@babel/types'
import { log } from 'boot'
import { pathExists, readdir, readFile, rename, writeFile } from 'fs-extra'
import klaw from 'klaw'
import { join } from 'path'

export const upgradeComponentsToV1 = async (arg: {
  compFiles: string[]
  migrating: boolean
  compDir: string
}) => {
  const { compFiles, migrating, compDir } = arg
  const oldComps = compFiles.filter((e) => e.endsWith('.html'))
  let result = compFiles
  if (oldComps.length > 0) {
    if (!migrating) {
      console.log('\n')
    }
    log(
      'platform',
      `Renaming ${oldComps.length} component${
        oldComps.length > 1 ? 's' : ''
      } to jsx`,
      false
    )

    const upgrading: Promise<any>[] = []
    for (let i of oldComps) {
      const tsxFile = join(compDir, i.substr(0, i.length - 5) + '.tsx')
      const jsxFile = join(compDir, i.substr(0, i.length - 5) + '.jsx')
      const oldHtmlFile = join(compDir, i)
      upgrading.push(
        new Promise<void>(async (resolve) => {
          await rename(oldHtmlFile, jsxFile)
          if (await pathExists(tsxFile)) {
            let tsx = await readFile(tsxFile, 'utf-8')
            tsx = tsx.replace(
              'return eval(_component.render)',
              'return new Function(_component.render).bind(_component)()'
            )
            await writeFile(tsxFile, tsx)
          }

          resolve()
        })
      )
    }
    await Promise.all(upgrading)
    process.stdout.write(' OK\n')

    result = await readdir(compDir)
  }

  if (migrating) {
    const migrateList: string[] = []

    await new Promise((resolve) => {
      klaw(compDir)
        .on('data', async (item) => {
          if (!item.stats.isFile()) return
          if (item.path.endsWith('.tsx') || item.path.endsWith('.ts'))
            migrateList.push(item.path)
        })
        .on('end', resolve)
    })

    log('migrate', `Upgrading ${migrateList.length} component `, false)

    let listCount = 0
    for (let filePath of migrateList) {
      const source = await readFile(filePath, 'utf-8')

      const parsed = parse(source, {
        sourceType: 'module',
        plugins: ['jsx', 'typescript'],
      })

      let shouldWriteSource = false
      let lodash = {
        global: '',
        usage: {},
      }
      let root: NodePath<Program> | null = null
      traverse(parsed, {
        Program(path) {
          root = path
        },
        enter: (path) => {
          const c = path.node
          if (c.start && c.end) {
            if (lodash.global || Object.keys(lodash.usage).length > 0) {
              if (
                c.type === 'CallExpression' &&
                c.callee.type === 'MemberExpression' &&
                c.callee.object.type === 'Identifier' &&
                c.callee.property.type === 'Identifier' &&
                c.callee.object.name === lodash.global
              ) {
                const arg = { start: 0, end: 0 }
                for (let i of c.arguments) {
                  if (!i.start) arg.start = c.start
                  arg.end = c.end
                }

                if (arg.start && arg.end) {
                  if (filePath.indexOf('NewFilter.tsx') >= 0) {
                    console.log(
                      arg,
                      `${c.callee.property.name}(${source.substring(
                        arg.start,
                        arg.end
                      )} )`
                    )
                  }
                  path.replaceWithSourceString(
                    `${c.callee.property.name}(${source.substring(
                      arg.start,
                      arg.end
                    )} )`
                  )
                }

                lodash.usage[c.callee.property.name] = true
              }
            }

            if (c.type === 'ImportDeclaration') {
              const s = c.specifiers[0]
              if (c.source.value === 'lodash' && s.start && s.end) {
                if (s.type === 'ImportDefaultSpecifier') {
                  lodash.global = source.substring(s.start, s.end)
                  shouldWriteSource = true
                }

                if (
                  s.type === 'ImportSpecifier' &&
                  s.imported.type === 'Identifier'
                ) {
                  // const e = s.imported.name
                  // lodash.usage[e] = true

                  // const importDeclarations: string[] = []
                  // for (let s of c.specifiers) {
                  //   importDeclarations.push(
                  //     `import ${e} from 'lodash.${e.toLowerCase()}'`
                  //   )
                  //   console.log(s)
                  // }

                  // if (root)
                  //   root.unshiftContainer(
                  //     'body',
                  //     template(importDeclarations.join('\n'))()
                  //   )
                  shouldWriteSource = true
                }
              }

              if (c.source.value.startsWith('web-')) {
                shouldWriteSource = true
                c.source.value = 'web-' + c.source.value.substring(4)
              }
            }
          }
        },
      })

      if (lodash.global) {
        let root: NodePath<Program> | null = null
        traverse(parsed, {
          enter: (path) => {
            const c = path.node

            if (c.type === 'ImportDeclaration') {
              const s = c.specifiers[0]
              if (
                c.source.value === 'lodash' &&
                s.start &&
                s.end &&
                s.type === 'ImportDefaultSpecifier'
              ) {
                const usage = Object.keys(lodash.usage)
                try {
                  if (usage.length > 0) {
                    let importDeclarations = template(
                      usage
                        .map(
                          (e) => `import ${e} from 'lodash.${e.toLowerCase()}'`
                        )
                        .join('\n')
                    )()

                    if (!Array.isArray(importDeclarations)) {
                      importDeclarations = [importDeclarations]
                    }
                    path.insertAfter(importDeclarations)
                    path.remove()
                  } else {
                    path.remove()
                  }
                } catch (e) {
                  console.log(e)
                }
              }
            }
          },
        })
      }

      if (shouldWriteSource) {
        await writeFile(filePath, generate(parsed).code)
      }
      if (listCount++ % 20 === 0) {
        process.stdout.write('.')
      }
    }

    process.stdout.write(' OK\n')
    log('boot', 'Migration [OK]', false)
  }
  return result
}
