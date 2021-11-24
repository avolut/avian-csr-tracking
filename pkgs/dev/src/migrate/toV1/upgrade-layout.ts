import generate from '@babel/generator'
import { writeFile } from 'fs-extra'
import trim from 'lodash.trim'
import { join } from 'path'
import { Page } from 'platform/src/types'
import prettier from 'prettier'
import { baseDir, templateDir } from './parse-jsx'
import { parseEffect } from './upgrade-page'

export const upgradeLayout = async (page: any) => {
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
  await writeFile(join(baseDir.layout, `${page.id}.jsx`), code)

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
    } as Page,
    null,
    2
  )

  await writeFile(join(baseDir.layout, `${page.id}.json`), str)
}
