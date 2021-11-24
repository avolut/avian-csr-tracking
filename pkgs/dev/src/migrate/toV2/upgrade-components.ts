import generate from '@babel/generator'
import { waitUntil } from 'libs'
import { trim } from 'lodash'
import { remove, writeFile } from 'fs-extra'
import { join } from 'path'
import prettier from 'prettier'
import { parseEffect } from '../toV1/upgrade-page'
import { styleToCss } from './convert-css'
import { dirs, log } from 'boot'

export const upgradeComponentsToV2 = async (arg: {
  compFiles: string[]
  migrating: boolean
  compDir: string
  externals: Record<string, string>
}) => {
  const { compFiles, migrating, compDir, externals } = arg

  const compJsx = compFiles.filter((e) => e.endsWith('.jsx'))

  for (let p of compJsx) {
    const fullPath = join(compDir, p)
    const { effect, parsed, source } = await parseEffect(fullPath)

    let run = effect.run

    if (run.startsWith('()')) {
      run = `({meta, params, children}) ${run.substring(2)}`
    } else if (run.startsWith('async ()')) {
      run = `async ({meta, params, children}) ${run.substring(
        'async ()'.length
      )}`
    }

    styleToCss({ parsed, source })

    try {
      const code = prettier.format(
        `\
base({
    meta: ${effect.meta},
    init: ${run}
}, ({meta, children}) => (${trim(generate(parsed).code, ';')}))`,
        {
          parser: 'babel-ts',
        }
      )

      await remove(fullPath)
      await writeFile(
        join(compDir, p.substring(0, p.length - 4) + '.base.tsx'),
        code
      )
    } catch (e) {
      console.log('')
      log(
        'error',
        `Failed to convert: \n\n${fullPath.substring(
          dirs.root.length + 1
        )} | Error Message:`
      )
      console.log(e)
      await waitUntil(() => false)
    }
  }

  return compFiles
}
