import { dirs, log } from 'boot'
import { ensureDir, pathExists, readdir, readJson, remove } from 'fs-extra'
import { join } from 'path'
import { baseDir } from './parse-jsx'
import { upgradeAPI } from './upgrade-api'
import { upgradeLayout } from './upgrade-layout'
import { upgradePage } from './upgrade-page'

export const startMigration = async () => {
  const templateDir = join(dirs.app.web, 'cms', 'templates')

  const pendingUpgrade = {
    page: [] as any[],
    layout: [] as any[],
    api: [] as any[],
  }
  for (let file of await readdir(templateDir)) {
    if (file.endsWith('.json')) {
      const page = await readJson(join(templateDir, file))
      if (page.content.type === 'Page') {
        pendingUpgrade.page.push(page)
      } else if (page.content.type === 'Layout') {
        pendingUpgrade.layout.push(page)
      } else if (page.content.type === 'API') {
        pendingUpgrade.api.push(page)
      }
    }
  }

  const removeOld = async (id: string) => {
    if (await pathExists(join(templateDir, id + '.json')))
      await remove(join(templateDir, id + '.json'))

    if (await pathExists(join(templateDir, id + '.html')))
      await remove(join(templateDir, id + '.html'))
  }

  let listCount = 0

  log('migrate', `Upgrading ${pendingUpgrade.layout.length} layout `, false)
  await ensureDir(baseDir.layout)
  for (let layout of pendingUpgrade.layout) {
    await upgradeLayout(layout)
    await removeOld(layout.id)

    if (listCount++ % 20 === 0) {
      process.stdout.write('.')
    }
  }
  process.stdout.write(' OK \n')

  log('migrate', `Upgrading ${pendingUpgrade.page.length} page `, false)
  listCount = 0
  await ensureDir(baseDir.page)
  for (let page of pendingUpgrade.page) {
    await upgradePage(page)
    await removeOld(page.id)

    if (listCount++ % 20 === 0) {
      process.stdout.write('.')
    }
  }
  process.stdout.write(' OK \n')

  log('migrate', `Upgrading ${pendingUpgrade.api.length} API `, false)
  listCount = 0
  await ensureDir(baseDir.api)
  for (let api of pendingUpgrade.api) {
    await upgradeAPI(api)
    await removeOld(api.id)

    if (listCount++ % 20 === 0) {
      process.stdout.write('.')
    }
  }
  process.stdout.write(' OK \n')

}
