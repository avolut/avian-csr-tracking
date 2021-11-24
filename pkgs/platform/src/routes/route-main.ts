import { dirs } from 'boot'
import { matchesUA, resolveUserAgent } from 'browserslist-useragent'
import { FastifyReply, FastifyRequest } from 'fastify'
import { waitUntil } from 'libs'
import * as lite from 'caniuse-lite'
import { join, resolve } from 'path/posix'
import { PlatformGlobal } from 'src/types'

declare const global: PlatformGlobal

export const routeMain = async ({
  url,
  req,
  reply,
}: {
  url: string
  req: FastifyRequest
  reply: FastifyReply
}) => {
  if (req.headers.accept && req.headers.accept.indexOf('html') >= 0) {
    reply.type('text/html')
    reply.send(await prepareBody(req, url))
    return true
  }

  reply.code(404)
  if (req.method === 'get') {
    reply.send(await prepareBody(req, url))
    return true
  } else {
    reply.type('application/json')
    reply.send('{"status": "404 - NOT FOUND"}')
    return true
  }
  return false
}

const prepareBody = async (req: FastifyRequest, url: string) => {
  if (!global.cache.index) {
    await waitUntil(() => global.cache.index)
  }

  let index = global.cache.index
  if (typeof req.headers['user-agent'] === 'string') {
    if (
      !matchesUA(req.headers['user-agent'], {
        browsers: ['defaults'],
        allowHigherVersions: true,
        ignoreMinor: true,
        ignorePatch: true,
      }) &&
      global.cache.public.raw.doesExist('app/web/build/web/old/index.js')
    ) {
      index = index.replace(
        '<script type="module" src="/index.js"></script>',
        '<script src="/old/index.js"></script>'
      )
    }
  }

  return index.replace(
    '</title>',
    `</title><script src="/__init${
      url.startsWith('/') ? url : `/${url}`
    }"></script>`
  )
}
