import { dirs, log } from 'boot'
import { BuilderPool, Watcher } from 'builder'
import { copy, pathExists, readFile, remove } from 'libs/fs'
import { join } from 'path'
import { dbFiles } from '../utils/devFiles'
import { ensureMain } from '../utils/ensureMain'
import { ensureProject } from '../utils/ensureProject'
import { runPnpm } from '../utils/pnpm'
export const buildDB = async (pool: BuilderPool) => {
  return new Promise<void>(async (resolve) => {
    if (
      await ensureProject('db', dirs.app.db, {
        pkgs: {
          main: './build/index.js',
          types: './src/index.ts',
          devDependencies: {
            prisma: '*',
          },
          dependencies: {
            '@prisma/client': '*',
          },
        },
        files: dbFiles,
      })
    ) {
      await runPnpm('i')
    }
    const prismaIndex = join(
      dirs.app.db,
      'node_modules',
      '.prisma',
      'client',
      'index.js'
    )
    await pool.add('db', {
      root: dirs.app.db,
      in: join(dirs.app.db, 'src', 'index.ts'),
      out: join(dirs.app.db, 'build', 'index.js'),
      watch: [join(dirs.app.db, 'prisma', 'schema.prisma')],
      onChange: async (event, path) => {
        await remove(prismaIndex)
      },
      onBuilt: async () => {
        await ensureMain(dirs.app.db)
        await copy(
          join(dirs.app.db, 'prisma', 'schema.prisma'),
          join(dirs.build, 'pkgs', 'schema.prisma')
        )
        let generatePrisma = false
        if (await pathExists(prismaIndex)) {
          const index = await readFile(prismaIndex, 'utf-8')
          if (index.indexOf('model') < 0) {
            generatePrisma = true
          }
        } else {
          generatePrisma = true
        }
        if (generatePrisma) {
          await remove(join(dirs.app.db, 'node_modules'))
          const schemaPrisma = await readFile(
            join(dirs.app.db, 'prisma', 'schema.prisma')
          )
          if (schemaPrisma.indexOf('model') < 0) {
            await runPnpm(['prisma', 'db', 'pull'], {
              npx: true,
              cwd: dirs.app.db,
            })
          }
          await runPnpm(['prisma', 'generate'], { npx: true, cwd: dirs.app.db })
          log('boot', 'Building', false)
        }
        resolve()
      },
    })
  })
}
