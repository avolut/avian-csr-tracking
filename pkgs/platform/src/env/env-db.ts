import { join } from 'path'
import { dirs, log } from 'boot'
import { PlatformGlobal } from '../types'
import { execaNode } from 'execa'
import { pathExists } from 'libs/fs'
declare const global: PlatformGlobal

export const setupDbEnv = async () => {
  if (global.pool) {
    const dbPath = join(
      dirs.app.db,
      'node_modules',
      '.prisma',
      'client',
      'index.js'
    )
    delete require.cache[dbPath]
    const prisma = require(dbPath)
    const client = new prisma.PrismaClient({})
    global.db = client
    global.dmmf = prisma.dmmf
  } else {
    const prismaCli = join(
      global.buildPath.pkgs,
      'node_modules',
      'prisma',
      'build',
      'index.js'
    )

    if (
      !(await pathExists(
        join(global.buildPath.pkgs, 'node_modules', '.prisma')
      ))
    ) {
      log('boot', 'Generating prisma client', false)
      const gen = execaNode(prismaCli, ['generate'], {
        cwd: global.buildPath.pkgs,
      })
      await gen
      process.stdout.write(' [DONE]\n')
    }

    const dbPath = join(
      global.buildPath.pkgs,
      'node_modules',
      '@prisma',
      'client',
      'index.js'
    )
    delete require.cache[dbPath]
    const prisma = require(dbPath)
    const client = new prisma.PrismaClient({})
    global.db = client
    global.dmmf = prisma.dmmf
  }
}
