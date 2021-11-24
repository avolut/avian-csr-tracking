import { FastifyInstance } from 'fastify'
import fp from 'fastify-plugin'
import serializeJavascript from 'serialize-javascript'
import { PlatformGlobal } from './types'
declare const global: PlatformGlobal

export const jsonPlugin = fp(function (
  server: FastifyInstance,
  _: any,
  next: () => void
) {
  server.addContentTypeParser(
    'application/javascript',
    { parseAs: 'string' },
    function (_, body, done) {
      try {
        var newBody = {
          raw: body,
        }
        done(null, newBody)
      } catch (error: any) {
        error.statusCode = 400
        done(error, undefined)
      }
    }
  )
  server.addContentTypeParser(
    'application/vnd.api+json',
    { parseAs: 'string' },
    (_, body, done) => {
      try {
        done(null, body)
      } catch (err: any) {
        err.statusCode = 400
        done(err, undefined)
      }
    }
  )
  server.addContentTypeParser(
    'application/base.query',
    function (req, payload, done) {
      const data: any[] = []

      payload
        .on('data', function (chunk) {
          data.push(chunk)
        })
        .on('end', function () {
          const result = Buffer.concat(data)
          const nonceHeader = req.headers['x-nonce']
          if (nonceHeader && typeof nonceHeader === 'string') {
            const nonceMatch = nonceHeader.match(/.{1,2}/g)
            if (nonceMatch) {
              const nonce = new Uint8Array(
                nonceMatch.map((byte) => parseInt(byte, 16))
              )
              var decrypted = Buffer.alloc(
                result.length - global.bin.sodium.crypto_secretbox_MACBYTES
              )

              if (
                global.bin.sodium.crypto_secretbox_open_easy(
                  decrypted,
                  result,
                  nonce,
                  global.build.secret
                )
              ) {
                done(null, decrypted.toString('utf-8'))
              }
            }
          }
        })
    }
  )

  server.addHook('onSend', (_req, reply, payload, done) => {
    const err = null

    if ((reply as any).isCMS) {
      if (typeof payload === 'object') {
        if (!!(payload as any)._readableState) {
          // this is a stream
          done(err, payload)
        } else {
          done(
            err,
            typeof payload === 'object' ? serializeJavascript(payload) : payload
          )
        }
        return
      }
    }
    done(err, payload)
  })
  // your plugin code
  next()
})
