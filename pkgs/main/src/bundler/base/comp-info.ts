import { parse } from '@babel/core'
import { dirs } from 'boot'
import { readFile } from 'fs-extra'
import { join } from 'path'
import get from 'lodash.get'

export const getExternalImportMap = async () => {
  const externalSource = await readFile(
    join(dirs.app.web, 'src', 'external.tsx'),
    'utf-8'
  )

  const parsed = parse(externalSource, {
    sourceType: 'module',
  })
  const externalImportMap: Record<string, string> = {}
  for (let p of get(parsed, 'program.body.0.declaration.properties')) {
    const key: string = get(p, 'key.value') || get(p, 'key.name')
    const value: string = get(p, 'value.body.elements.0.arguments.0.value')

    if (key && value) {
      externalImportMap[value] = key
    } 
  }
  return externalImportMap
}
