import arg from 'arg'
import { publicBundle } from './public'
;(async () => {
  function toArrayBuffer(buf: Buffer) {
    var ab = new ArrayBuffer(buf.length)
    var view = new Uint8Array(ab)
    for (var i = 0; i < buf.length; ++i) {
      view[i] = buf[i]
    }
    return view
  }
  const args = arg({})
  const type = (args._[0] || 'public') as any
  const res = await publicBundle.db.list(type, 'raw')
  
  for (const [key, ref] of Object.entries(res)) {
    if (ref.value instanceof Buffer) {
      const uint8array = toArrayBuffer(ref.value)
     publicBundle.db.compressSingle(type, key, uint8array)
    } else {
      console.log(ref)
    }
  }
})()
