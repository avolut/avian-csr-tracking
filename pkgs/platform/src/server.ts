import { dirs, log } from 'boot'
import fastify from 'fastify'
import fastifyCookie from 'fastify-cookie'
import fastifyCors from 'fastify-cors'
import fastifyEtag from 'fastify-etag'
import fastifyForm from 'fastify-formbody'
import fastifyMultipart from 'fastify-multipart'
import { fastifyRequestContextPlugin } from 'fastify-request-context'
import fastifyStatic from 'fastify-static'
import fastifyWS from 'fastify-websocket'
import { ellapsedTime } from 'libs'
import { pathExists } from 'libs/fs'
import { join } from 'path'
import {
  reloadAsset,
  reloadSingleBaseCache,
  reloadSingleComponentCache
} from './env/env-cache'
import { handleError } from './error'
import { jsonPlugin } from './middleware'
import { routeInit } from './routes/route-init'
import { authPlugin } from './session/session-register'
import { PlatformGlobal } from './types'

declare const global: PlatformGlobal

export type ServerInstance = ReturnType<typeof fastify>
export const startServer = async () => {
  const server = fastify()

  server.register(fastifyMultipart as any)
  server.register(fastifyCookie as any)
  server.register(fastifyForm as any)
  server.register(fastifyWS as any)
  server.register(fastifyCors as any, {
    origin: '*',
    exposedHeaders: 'x-nonce',
    optionsSuccessStatus: 200,
    allowedHeaders:
      'accept, origin, User-Agent, Sec-Fetch-Mode, Referer, host, connection, Accept-Encoding, Accept-Language, Content-Length, content-type, x-nonce, cookie, authorization, get-server-props',
  })
  server.register(fastifyEtag as any)
  server.register(jsonPlugin as any)
  server.register(authPlugin as any)
  server.register(fastifyRequestContextPlugin)
  server.register(fastifyStatic as any, {
    root: global.buildPath.public,
    serve: false,
  })
  server.setErrorHandler(handleError)

  routeInit(server)

  if (global.mode === 'dev') {
    // delete require.cache[join(dirs.pkgs.dev, 'build', 'index.js')]
    const dev = await import(join(dirs.pkgs.dev, 'build', 'index.js'))
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

        if (!(await pathExists(join(global.buildPath.public, 'index.css')))) {
          log(
            'boot',
            'TailwindCSS building, Please wait (web may show blank white) '
          )
        }
        resolve()
      })
    })
  }
  process.on('uncaughtException', (err) => {
    console.dir(err)
  })
  if (global.pool) {
    global.pool.onMessage = async (msg: any) => {
      if (msg === 'exit') {
        await server.close()
        if (global.pptr) {
          await global.pptr.close()
        }
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
        await reloadAsset()
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
