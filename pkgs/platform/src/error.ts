import { log } from 'boot'
import { PlatformGlobal } from './types'

declare const global: PlatformGlobal

export const handleError = function (error: any, req: any, reply: any) {
  const rqh = JSON.stringify(req.headers, null, 2).split('\n').join('\n       ')

  const reh = JSON.stringify(reply.getHeaders(), null, 2)
    .split('\n')
    .join('\n       ')
  log(
    'error',
    `
  URL           : ${req.url} (${reply.statusCode})
  Req Headers   : ${rqh.substr(1, rqh.length - 2)}
  Reply Headers : ${reh.substr(1, reh.length - 2).trim()}
  Stack Trace   :  
  ${
    !!error && !!error.stack
      ? '     ' + error.stack.split('\n').join('\n     ')
      : error
  } 
`
  )
  // Send error response
  reply
    .type('application/json')
    .status(500)
    .send({
      status: 'error',
      code: error.statusCode || 500,
      error:
        !!error && !!error.stack && global.mode === 'dev'
          ? error.stack.split('\n')
          : error,
    })
}
