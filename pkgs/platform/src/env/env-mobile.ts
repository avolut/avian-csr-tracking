import { dirs, log, timelog } from 'boot'
import {
  copy,
  remove,
  pathExists,
  writeFile,
  ensureDir,
  readJson,
  writeJson,
} from 'libs/fs'
import { set } from 'lodash'
import { networkInterfaces } from 'os'
import { join } from 'path'

export const generateMobile = async () => {
  const baseDir = join('app/mobile/www')

  if (await pathExists(baseDir)) await remove(baseDir)

  if (!(await pathExists(join(dirs.app.mobile, 'capacitor.config.json')))) {
    await writeFile(
      join(dirs.app.mobile, 'capacitor.config.json'),
      JSON.stringify(
        {
          appId: 'com.andromedia.base',
          appName: 'Andro Base',
          bundledWebRuntime: true,
          webDir: 'www',
          plugins: {
            SplashScreen: {
              launchShowDuration: 0,
            },
          },
          ios: {
            contentInset: 'never',
          },
        },
        null,
        2
      )
    )
  }

  if (global.mode === 'prod') {
    // let done = timelog('platform.prod', 'Generating mobile www folder')
    await copy(join(global.buildPath.public), join(baseDir))

    const json = await readJson(join(dirs.app.mobile, 'capacitor.config.json'))
    if (json.server) {
      delete json.server.url
    }
    await writeJson(join(dirs.app.mobile, 'capacitor.config.json'), json, {
      spaces: 2,
    })
    // done()
  } else {
    const nets = networkInterfaces()
    const results = Object.create(null) // Or just '{}', an empty object

    let ip = 'localhost'
    for (const [name, net] of Object.entries(nets)) {
      if (net !== undefined) {
        for (const n of net) {
          // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
          if (n.family === 'IPv4' && !n.internal) {
            if (!results[name]) {
              results[name] = []
            }
            results[name].push(n.address)
            if (ip === 'localhost') {
              ip = n.address
            }
          }
        }
      }
    }

    await ensureDir(baseDir)

    const json = await readJson(join(dirs.app.mobile, 'capacitor.config.json'))
    set(json, 'server.url', `http://${ip}:${global.port}`)
    await writeJson(join(dirs.app.mobile, 'capacitor.config.json'), json, {
      spaces: 2,
    })
    await writeFile(
      join(baseDir, 'index.html'),
      `You should be redirected to http://${ip}:${global.port}`
    )
  }
}
