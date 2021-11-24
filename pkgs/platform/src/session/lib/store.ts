import { EventEmitter } from 'events'
import type { RootDatabase } from 'lmdb'
import { PlatformGlobal } from 'src/types'

declare const global: PlatformGlobal

class Store extends EventEmitter {
  store: Record<string, { lastStore: number; data: any }> = {}

  set(sid: string, session: any, callback?: any) {
    if (!this.store[sid]) {
      this.store[sid] = { lastStore: 0, data: {} }
    }
    this.store[sid].lastStore = new Date().getTime()
    this.store[sid].data = session
    if (callback) callback()

    const jsonSession = JSON.stringify(session)
    global.bundle.session.put(sid, jsonSession)
  }

  get(sid: string, callback?: any) {
    if (this.store[sid]) {
      if (callback) callback(null, this.store[sid].data)
      return this.store[sid].data
    } else {
      if (callback) callback(null, { role: 'guest' })
    }
  }

  destroy(sid: string, callback: () => void) {
    delete this.store[sid]
    global.bundle.session.remove(sid)
    callback()
  }

  constructor() {
    super()
    this.store = {}
    const date = new Date().getTime()
    for (let row of global.bundle.session.getRange({})) {
      if (typeof row.key === 'string') {
        this.store[row.key] = { data: JSON.parse(row.value), lastStore: date }
      }
    }
  }
}

export default Store
