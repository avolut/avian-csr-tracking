import { writeFile } from 'libs/fs'
import { join } from 'path'
import { API } from 'platform/src/types'
import { baseDir } from './parse-jsx'

export const upgradeAPI = async (page: any) => {
  if (page.content.server_on_load) {
    await writeFile(
      join(baseDir.api, page.id + '_api.ts'),
      page.content.server_on_load
    )
  }

  const str = JSON.stringify(
    {
      id: page.id,
      name: page.title,
      type: 'API',
      url: page.slug,
      serverOnLoad: async () => {},
    } as API,
    null,
    2
  )

  await writeFile(join(baseDir.api, `${page.id}.json`), str)
}
