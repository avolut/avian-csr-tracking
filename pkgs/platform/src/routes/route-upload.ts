import { dirs } from 'boot'
import { FastifyReply, FastifyRequest } from 'fastify'
import { basename, dirname, join } from 'path'
import { createWriteStream } from 'fs'
import { pipeline } from 'stream'
import util from 'util'

import fsextra from 'fs-extra';
const { pathExists, readdir, stat, ensureDir } = fsextra;

const pump = util.promisify(pipeline)

export const routeUpload = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  const url = req.url

  if (url.indexOf('/upload') === 0) {
    let rpath = decodeURIComponent(url).substr('/upload/'.length)
    let mpath = join(dirs.root, 'uploads', rpath)
    if (
      mpath.indexOf(join(dirs.root, 'uploads')) === 0 &&
      (await pathExists(mpath))
    ) {
      return reply.sendFile(basename(mpath), dirname(mpath))
    }
    reply.code(404)
    reply.send({ status: 'file not found' })
    return true
  }

  if (url.indexOf('/__upload') === 0) {
    const uploadDir = join(dirs.root, 'uploads')
    if (url.indexOf('/__upload/dirs') === 0) {
      const result = {
        path: '',
        dirs: [] as any[],
        files: [] as any[],
      }
      let rpath = url.substr('/__upload/dirs'.length)
      let mpath = join(uploadDir, rpath)

      if (mpath.indexOf(uploadDir) === 0 && (await pathExists(uploadDir))) {
        const rdirs = await readdir(mpath)
        result.path = rpath
        for (let i in rdirs) {
          const st = await stat(join(mpath, rdirs[i]))
          result[st.isFile() ? 'files' : 'dirs'].push({
            name: rdirs[i],
            path: rpath === '' ? '/' : '',
            size: st.size,
            date: new Date(st.mtimeMs),
          })
        }
      }

      return reply.send(result)
    }

    await upload(req, reply)
    return true
  }
}

const upload = async (req: FastifyRequest, reply: FastifyReply) => {
  const parts = await req.files()
  const uploadDir = join(dirs.root, 'uploads')
  await ensureDir(uploadDir)

  for await (const part of parts) {
    const file = join(uploadDir, part.fieldname, part.filename)
    if (file.indexOf(uploadDir) === 0) {
      await ensureDir(dirname(file))
    }

    await pump(part.file, createWriteStream(file))
  }

  reply.send('ok')
}