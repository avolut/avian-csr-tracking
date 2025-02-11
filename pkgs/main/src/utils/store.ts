import bsql from 'better-sqlite3'
import { EventEmitter } from 'events'
import { ensureDirSync, pathExistsSync } from 'libs/fs'
import { dirname } from 'path'

class Store extends EventEmitter {
  db: bsql.Database
  store: Record<string, { lastStore: number; data: any }> = {}

  async set(sid: string, session: any, callback?: any) {
    if (!this.store[sid]) {
      this.store[sid] = { lastStore: 0, data: {} }
    }
    this.store[sid].lastStore = new Date().getTime()
    this.store[sid].data = session
    if (callback) callback()

    const jsonSession = JSON.stringify(session)
    const stmt = this.db.prepare(`
    INSERT INTO sessions(key,value) VALUES(?,?)
  ON CONFLICT(key) DO UPDATE SET value=?;
  `)
    stmt.run(sid, jsonSession, jsonSession)
  }

  get(sid: string, callback?: any) {
    if (this.store[sid]) {
      if (callback) callback(null, this.store[sid].data)
      return this.store[sid].data
    } else {
      if (callback) callback(null, { role: 'guest' })
    }
  }

  async destroy(sid: string, callback: () => void) {
    delete this.store[sid]
    this.db.prepare(`DELETE FROM sessions WHERE key = ?`).run(sid)
    callback()
  }

  constructor(path: string) {
    super()
    this.store = {}
    if (!pathExistsSync(dirname(path))) {
      ensureDirSync(dirname(path))
    }
    this.db = new bsql(path)
    this.db.exec(`
CREATE TABLE IF NOT EXISTS sessions (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);
`)
    const res = this.db.prepare('select * from sessions').all()
    const date = new Date().getTime()
    for (let row of res) {
      this.store[row.key] = { data: JSON.parse(row.value), lastStore: date }
    }
  }
}

export default Store
