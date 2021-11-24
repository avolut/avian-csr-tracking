export { matchRoute } from './match-route'
export { waitUntil } from './wait-until' 
export { ellapsedTime } from './ellapsed-time'
import { db as dbImpl, dbAll as dbAllImpl } from 'db'
import { prepareAllDBClient, prepareDBClient } from './db-client'
export const db: typeof dbImpl & { query: (sql: string) => Promise<any[]> } =
  prepareDBClient('main')
export const dbAll: typeof dbAllImpl = prepareAllDBClient()
