import { log } from 'boot'
import { upgradeLayoutV2 } from './upgrade-layout'
import { upgradePageV2 } from './upgrade-page'

export const startMigrationV2 = async (arg: {
  page: string[]
  layout: string[]
}) => {
  const { page, layout } = arg

  log('migrate', `Transforming ${layout.length} layout `, false)
  let listCount = 0
  for (let item of layout) {
    await upgradeLayoutV2(item)
    if (listCount++ % 20 === 0) {
      process.stdout.write('.')
    }
  }

  process.stdout.write(' OK \n')

  log('migrate', `Transforming ${page.length} page `, false)
   listCount = 0
  for (let item of page) {
    await upgradePageV2(item)

    if (listCount++ % 20 === 0) {
      process.stdout.write('.')
    }
  }
  process.stdout.write(' OK \n')
}
