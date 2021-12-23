import { FastifyReply, FastifyRequest } from 'fastify'
import { PlatformGlobal } from 'src/types'
import chromePaths from 'chrome-paths'
import { pathExists } from 'libs/fs'
import { dirs, log } from 'boot'
import { join } from 'path'

declare const global: PlatformGlobal

export const routePdf = async (req: FastifyRequest, reply: FastifyReply) => {
  const { mode, id } = req.params as { mode: string; id: string }

  if (!global.pdf) {
    global.pdf = { raw: {}, gen: {} }
  }

  if (id) {
    if (mode === 'gen') {
      global.pdf.raw[id] = req.body as any

      if (!global.pptr) {
        await startPptr()
      }

      if (global.pptr) {
        const page = await global.pptr.newPage()
        await page.setViewport({
          width: 800,
          height: 600,
          deviceScaleFactor: 2,
        })
        await page.goto(`http://localhost:${global.port}/__pdf/pptr/${id}`, {
          waitUntil: 'networkidle0',
        })
        global.pdf.gen[id] = await page.pdf({
          format: 'a4',
          printBackground: true,
          displayHeaderFooter:
            !!global.pdf.raw[id].header || !!global.pdf.raw[id].footer,
          headerTemplate: global.pdf.raw[id].header,
          footerTemplate: global.pdf.raw[id].footer,
          margin: global.pdf.raw[id].margin,
          landscape: !!global.pdf.raw[id].landscape,
        })
        await page.close()

        // clear generated pdf after 10s to save memory
        // setTimeout(() => {
        //   delete global.pdf.raw[id]
        //   delete global.pdf.gen[id]
        // }, 10000)
      }
    } else if (mode === 'pptr') {
      reply.type('text/html')
      reply.send(global.pdf.raw[id].html)
    } else if (mode === 'dl') {
      reply.type('application/pdf')
      reply.send(global.pdf.gen[id])
    }
  }

  reply.send({ status: 'ok' })
}

export const startPptr = async () => {
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
    if (chromePaths.chrome || chromePaths.chromium) {
      global.bin.pptr
        .launch({
          headless: false,
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
}
