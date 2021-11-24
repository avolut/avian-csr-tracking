import { clearScreen } from 'boot'
import { dirs, log } from 'boot'
import { BuilderPool } from 'builder'
import { waitUntil } from 'libs'
import { join } from 'path'
import { MainGlobal } from '../start'
import { ensureMain } from '../utils/ensureMain'
import { ensureProject } from '../utils/ensureProject'
import { runPnpm } from '../utils/pnpm'

declare const global: MainGlobal

export const buildLibs = async (pool: BuilderPool, mode: 'dev' | 'prod') => {
  process.stdout.write(' • Libs')
  if (await ensureProject('server', dirs.pkgs.libs)) {
    runPnpm('i')
  }

  await pool.add('libs', {
    root: dirs.pkgs.libs,
    in: join(dirs.pkgs.libs, 'src', 'index.tsx'),
    out: join(dirs.pkgs.libs, 'build', 'index.js'),
    watch: mode === 'prod' ? undefined : [join(dirs.pkgs.libs, 'src')],
    onChange:
      mode === 'prod'
        ? undefined
        : async (event, path) => {
            global.rootstamp = new Date().getTime()
            await pool.rebuild('libs')

            clearScreen()
            log('boot', 'Development • Restarting Web Server')
            await pool.rebuild('platform')
            pool.send('platform', `start|${global.rootstamp}`)
          },
    onBuilt: async () => {
      await ensureMain(dirs.pkgs.libs)
    },
  })
}
