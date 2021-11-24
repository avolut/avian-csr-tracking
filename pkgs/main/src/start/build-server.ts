import { clearScreen, dirs, log } from 'boot'
import { BuilderPool } from 'builder'
import { join } from 'path'
import { MainGlobal } from '../start'
import { serverFiles } from '../utils/devFiles'
import { ensureMain } from '../utils/ensureMain'
import { ensureProject } from '../utils/ensureProject'
import { runPnpm } from '../utils/pnpm'

declare const global: MainGlobal

export const buildServer = async (pool: BuilderPool, mode: 'dev' | 'prod') => {
  process.stdout.write(' • Server')
  if (
    await ensureProject('server', dirs.app.server, {
      pkgs: {
        main: './build/index.js',
        types: './src/index.ts',
      },
      files: serverFiles,
    })
  ) {
    await runPnpm('i')
  }
  await pool.add('server', {
    root: dirs.app.server,
    in: join(dirs.app.server, 'src', 'index.ts'),
    out: join(dirs.app.server, 'build', 'index.js'),
    watch: mode === 'prod' ? undefined : [join(dirs.app.server, 'src')],
    buildOptions: {
      bundle: true,
      platform: 'node',
      external: [],
      format: 'cjs',
      nodePaths: [
        join(dirs.build, 'pkgs', 'node_modules'),
        join(dirs.root, 'node_modules'),
      ],
      target: 'node' + process.versions.node,
    },
    onChange:
      mode === 'prod'
        ? undefined
        : async (event, path) => {
            global.rootstamp = new Date().getTime()
            clearScreen()
            log('boot', 'Development • Restarting Web Server')
            await pool.rebuild('platform')
            pool.send('platform', `start|${global.rootstamp}`)
          },
    onBuilt: async () => {
      await ensureMain(dirs.app.server)
    },
  })
}
