
import { generate, parse, traverse } from 'libs/babel'
import { pathExists, readFile, writeFile } from 'libs/fs'
import trim from 'lodash.trim'
import { join } from 'path'
import prettier from 'prettier'
import type { Page } from '../../../../platform/src/types'
import { baseDir, templateDir } from './parse-jsx'

export const parseEffect = async (existingHtmlPath: string) => {
  let source = ''
  if (await pathExists(existingHtmlPath)) {
    source = await readFile(existingHtmlPath, 'utf-8')
  }

  const parsed = parse(source, {
    sourceType: 'module',
    plugins: ['jsx', 'typescript'],
  })

  const effect = { meta: '', init: '' }

  traverse(parsed, {
    enter: (path) => {
      const c = path.node
      if (
        c.type === 'JSXElement' &&
        c.openingElement.name.type === 'JSXIdentifier' &&
        c.start &&
        c.end
      ) {
        if (c.openingElement.name.name === 'effect') {
          for (let a of c.openingElement.attributes) {
            if (
              a.type === 'JSXAttribute' &&
              a.name.type === 'JSXIdentifier' &&
              a.value
            ) {
              if (a.value.type === 'JSXExpressionContainer') {
                const s = a.value.expression

                if (s.start && s.end) {
                  if (a.name.name === 'meta') {
                    effect.meta = source.substring(s.start, s.end)
                  } else if (a.name.name === 'run') {
                    effect.init = source.substring(s.start, s.end)
                  }
                }
              }
            }
          }
          path.remove()
        }
      }
    },
  })
  return {
    parsed,
    source,
    effect: {
      meta: effect.meta.trim() || '{}',
      run: effect.init.trim() || '() => {}',
    },
  }
}

export const upgradePage = async (page: any) => {
  const existingHtmlPath = join(templateDir, `${page.id}.html`)
  const { effect, parsed } = await parseEffect(existingHtmlPath)
  const code = prettier.format(
    `\
<>
  <effect meta={${effect.meta}} run={${effect.run}}/>
  ${trim(generate(parsed).code, ';')}
</>`,
    {
      parser: 'babel-ts',
    }
  )
  await writeFile(
    join(baseDir.page, `${page.id}-${page.title.replace(/[\W_]+/g, '-')}.jsx`),
    code
  )

  if (page.content.server_on_load) {
    await writeFile(
      join(baseDir.layout, page.id + '_api.ts'),
      page.content.server_on_load
    )
  }

  const str = JSON.stringify(
    {
      id: page.id,
      name: page.title,
      layout_id: page.layout_id || page.parent_id,
      url: page.slug,
    } as Page,
    null,
    2
  )
  await writeFile(join(baseDir.page, `${page.id}.json`), str)
}
