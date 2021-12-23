import { ensureDir, pathExists, readJson, writeFile, writeJson } from 'libs/fs'
import { join } from 'path'
import prompt from 'prompt'
import { dirs, log } from '../main'

export const dbAdd = async () => {
  try {
    let { name, url } = await getDbConn()

    name = name.replace(/\W/g, '').toLowerCase()
    const dir = join(dirs.app.db, 'more', name)

    if (await pathExists(dir)) {
      log('base', `Adding db failed, "${name}" already exits.`)
    }

    await ensureDir(dir)
    const pkgJsonPath = join(dirs.app.db, 'package.json')
    const pkgJson = await readJson(pkgJsonPath)

    pkgJson.name = `db-${name}`
    await writeJson(join(dir, 'package.json'), pkgJson, { spaces: 2 })
    await ensureDir(join(dir, 'prisma'))
    await writeFile(
      join(dir, 'index.ts'),
      `\
import type prisma from '.prisma/client'
import { PrismaClient } from '@prisma/client'

export const db = new PrismaClient() as prisma.PrismaClient`
    )
    await writeFile(
      join(dir, 'prisma', 'schema.prisma'),
      `\
generator client {
  provider = "prisma-client-js"
  previewFeatures = ["filterJson"]
}

datasource db {
  provider = "postgresql"
  url      = "${url}"
}`
    )
  } catch (e) {}
}

const getDbConn = () => {
  prompt.message = '  '
  prompt.delimiter = ''
  console.log('\nAdd More Database to Base')
  console.log(
    `\
  Please see this reference for connection url:
  https://www.prisma.io/docs/reference/database-reference/connection-urls`
  )

  console.log('')

  return new Promise<{ name: string; url: string }>((resolve) => {
    prompt.get(
      [
        {
          name: 'name',
          description: '  Database Name:',
          required: true,
        },
        {
          name: 'url',
          description: '  Connection URL:',
          required: true,
        },
      ],
      function (err, result) {
        resolve(result)
      }
    )
  })
}
