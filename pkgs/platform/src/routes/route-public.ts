import { dirs } from 'boot'
import { FastifyReply, FastifyRequest } from 'fastify'
import { lstat, readFile } from 'libs/fs'
import { transformFileAsync } from 'libs/babel'
import mime from 'mime-types'
import { join } from 'path'
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
  const cache = global.cache.public

  if (url === '/index.html') return false

  if (!cache.raw[url]) {
    const baseDir = global.buildPath.public
    file = `${baseDir}${url}`

    if (url.startsWith('/fimgs')) {
      file = join(
        dirs.app.web,
        'figma',
        'imgs',
        url.substring('/fimgs/'.length)
      )
    }

    if (url.startsWith('/__ext')) {
      file = join(dirs.pkgs.web, 'ext', url.substring('/__ext/'.length))
    }

    if (url.startsWith('/min-maps')) {
      file = join(
        dirs.pkgs.web,
        'ext',
        'monaco',
        url.substring('/__ext/'.length)
      )
    }

    if (!(await isFile(file))) {
      file = join(dirs.app.web, 'public', url)
    }

    if (await isFile(file)) {
      if (req.headers['x-ext-transpile-es5'] === 'y') {
        if (file.endsWith('buffer.js')) {
          cache.raw[url] = await readFile(file)
        } else {
          const res = await transformFileAsync(file, {
            presets: [
              [
                '@babel/env',
                {
                  targets: {
                    browsers: 'Chrome <= 45',
                  },
                  useBuiltIns: 'entry',
                  corejs: { version: '3.8', proposals: true },
                },
              ],
            ],
          })
          cache.raw[url] = res?.code
        }
      } else {
        cache.raw[url] = await readFile(file)
      }
    }
  }

  if (cache.raw[url]) {
    if (!cache.br[url]) {
    } else {
    }
    if (!cache.gz[url]) {
    } else {
    }
    reply.type(mime.lookup(url))
    reply.send(cache.raw[url])
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
