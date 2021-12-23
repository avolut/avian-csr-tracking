import { generate, NodePath, parse, template, traverse } from 'libs/babel'
import { dirs } from 'boot'
import prettier from 'prettier'
import { readFile, writeFile } from 'libs/fs'
import klaw from 'klaw'
import { waitUntil } from 'libs'
import { get, trim } from 'lodash-es'
import { join } from 'path'
export const startMigrationV3 = async () => {
  const oldTsx: string[] = []
  await new Promise((resolve) => {
    klaw(join(dirs.app.web, 'src'))
      .on('data', async (item) => {
        if (!item.stats.isFile()) return
        if (item.path.endsWith('.base.tsx')) oldTsx.push(item.path)
      })
      .on('end', resolve)
  })
  for (let i of oldTsx) {
    try {
      const source = await readFile(i, 'utf-8')
      const parsed = parse(source, {
        sourceType: 'module',
        plugins: ['jsx', 'typescript'],
      })
      let shouldWrite = false

      traverse(parsed, {
        enter: (path) => {
          const c = path.node
          if (c.start && c.end) {
            const cp = path

            if (
              cp &&
              c.type === 'ObjectProperty' &&
              c.key.type === 'Identifier' &&
              c.key.name === 'meta' &&
              cp.parent.type === 'ObjectExpression' &&
              cp.parentPath?.parent.type === 'CallExpression' &&
              cp.parentPath.parent.callee.type === 'Identifier' &&
              cp.parentPath.parent.callee.name === 'base'
            ) {
              const val = c.value

              if (
                val &&
                val.type === 'ObjectExpression' &&
                val.start &&
                val.end
              ) {
                const snip = source.substring(val.start, val.end)
                const ttemplate = `\
{
  meta: () => {
    const meta = ${trim(snip.trim(), ';')};
    return meta;
  }
}`
                const tsnip = template(ttemplate, {
                  sourceType: 'module',
                  placeholderPattern: false,
                  plugins: ['jsx', 'typescript'],
                })()

                shouldWrite = true
                c.value = get(tsnip, 'body.0.body.expression')
              }
            }
          }
        },
      })

      if (shouldWrite) {
        const code = prettier.format(generate(parsed).code, {
          parser: 'babel-ts',
        })

        await writeFile(i, code)
      }
    } catch (e) {
      console.log(`
      
      Failed to upgrade to v3: ${i.substring(dirs.root.length + 1)} 
      
      ${e}
      `)
      await waitUntil(() => false)
    }
  }

  await writeFile(join(dirs.root, 'app', 'base.version'), '3.1')
}
