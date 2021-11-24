import { dirs, log } from 'boot'
import fastify from 'fastify'
import fastifyCookie from 'fastify-cookie'
import fastifyEtag from 'fastify-etag'
import fastifyForm from 'fastify-formbody'
import fastifyMultipart from 'fastify-multipart'
import fastifyStatic from 'fastify-static'
import fastifyWS from 'fastify-websocket'
import chromePaths from 'chrome-paths'
import { ellapsedTime, waitUntil } from 'libs'
import { join } from 'path'
import { reloadSingleBaseCache, reloadSingleComponentCache } from './env/env-cache'
import { handleError } from './error'
import { jsonPlugin } from './middleware'
import { routeInit } from './routes/route-init'
import { authPlugin } from './session/session-register'
import { PlatformGlobal } from './types'
import { pathExists } from 'fs-extra'
declare const global: PlatformGlobal

export type ServerInstance = ReturnType<typeof fastify>
export const startServer = async () => {
  const server = fastify()

  server.register(fastifyMultipart)
  server.register(fastifyCookie)
  server.register(fastifyForm)
  server.register(fastifyWS)
  server.register(fastifyEtag)
  server.register(jsonPlugin)
  server.register(authPlugin)
  server.register(fastifyStatic, {
    root: global.buildPath.public,
    serve: false,
  })
  server.setErrorHandler(handleError)

  routeInit(server)

  if (global.mode === 'dev') {
    delete require.cache[join(dirs.pkgs.dev, 'build', 'index.js')]
    const dev = require(join(dirs.pkgs.dev, 'build', 'index.js'))
    if (dev && dev.startDev) {
      await dev.startDev(server, global.pool?.parent)
    }
  }

  let started = false
  const start = (port: number) => {
    return new Promise(async (resolve: any) => {
      if (global.pool?.shouldExit) {
        return
      }

      server.listen(port, '0.0.0.0', async (err) => {
        started = true

        if (err) {
          console.error(err)
          process.exit(0)
        }

        let time = `[${ellapsedTime(global.build.tstamp)}s] `

        log(
          'platform',
          `Ready ${time}http://localhost${
            port === 80 || port === 443 ? `` : `:${port}`
          }`
        )
        resolve()
      })

      const hasFullPptr = await pathExists(
        join(dirs.root, 'node_modules', 'puppeteer', 'cjs-entry.js')
      )

      if (hasFullPptr) {
        global.bin.pptr
          .launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
            ignoreHTTPSErrors: true,
          })
          .then((pptr) => {
            global.pptr = pptr
          })
      } else {
        if (chromePaths.chrome) {
          global.bin.pptr
            .launch({
              headless: true,
              executablePath: chromePaths.chrome,
              ignoreHTTPSErrors: true,
            })
            .then((pptr) => {
              global.pptr = pptr
            })
        } else {
          log('pptr', `Chrome Not Found, PDF disabled.`)
        }
      }
    })
  }

  if (global.pool) {
    global.pool.onMessage = async (msg: any) => {
      if (msg === 'exit') {
        await server.close()
        if (global.pptr) {
          await global.pptr.close()
        }
        process.exit(0)
        return
      }
      if (msg.startsWith('reload')) {
        const [_, type, file] = msg.split('|')
        if (type !== 'all') {
          if (type === 'comp') {
            reloadSingleComponentCache(file)
          } else {
            reloadSingleBaseCache(type, file)
          }
        }
        global.dev?.broadcast({ type: 'hmr-reload-all' })
      }
      if (msg.startsWith('start')) {
        if (started) return
        const [_, port, tstamp] = msg.split('|')
        global.port = port
        global.build.tstamp = tstamp
        start(global.port)
      }
    }
    global.pool.parent.notify('platform-ready')
    return
  }

  start(global.port)
}
