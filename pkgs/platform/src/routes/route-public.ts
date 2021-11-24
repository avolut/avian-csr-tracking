import { dirs } from 'boot'
import { FastifyReply, FastifyRequest } from 'fastify'
import { lstat } from 'fs-extra'
import mime from 'mime-types'
import { extname, join } from 'path'
import { PlatformGlobal } from 'src/types'

declare const global: PlatformGlobal

export const routePublic = async ({
  url,
  req,
  reply,
}: {
  url: string
  req: FastifyRequest
  reply: FastifyReply
}) => {
  let _url = decodeURIComponent(url)

  if (_url === '/' || _url === '') {
    return false
  }

  if (await serveCached(req, reply, _url)) {
    return true
  }

  return false
}

export const serveCached = async (
  req: FastifyRequest,
  reply: FastifyReply,
  url: string
) => {
  let file = url
  if (!global.cache.public.raw.doesExist(file)) {
    file = `app/web/build/web${url}`

    if (url.startsWith('/fimgs')) {
      file = `app/web/figma/imgs/${url.substr('/fimgs/'.length)}`
    }

    if (url.startsWith('/__ext')) {
      file = `pkgs/web/ext/${url.substr('/__ext/'.length)}`
    }

    if (url.startsWith('/min-maps')) {
      file = `pkgs/web/ext/monaco/${url.substr('/__ext/'.length)}`
    }
  }

  if (global.cache.public.raw.doesExist(file)) {
    const gz = global.cache.public.gz.doesExist(file)
    const br = global.cache.public.br.doesExist(file)

    const type = mime.types[extname(file).substr(1)]
    if (type) {
      reply.type(type)
    }

    const acceptEncoding = req.headers['accept-encoding']
    if (acceptEncoding) {
      if (!!br && acceptEncoding.indexOf('br') >= 0) {
        reply.header('content-encoding', 'br')
        reply.send(global.cache.public.br.getEntry(file)?.value)
        return true
      }

      if (!!gz && acceptEncoding.indexOf('gz') >= 0) {
        reply.header('content-encoding', 'gzip')
        reply.send(global.cache.public.gz.getEntry(file)?.value)
        return true
      }
    }

    reply.send(global.cache.public.raw.getEntry(file)?.value)
    return true
  }
}

const isFileCache = new Map<string, boolean>()
export const isFile = async (file: string) => {
  try {
    const status = isFileCache.get(file)
    if (status === undefined) {
      const stat = await lstat(file)
      if (stat.isFile()) {
        isFileCache.set(file, true)
        return true
      } else {
        isFileCache.set(file, false)
        return false
      }
    }
    return status
  } catch (e) {
    return false
  }
}
