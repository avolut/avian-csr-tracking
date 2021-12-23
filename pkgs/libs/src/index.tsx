import type { db as dbImpl } from '../../../app/db/index'
import { prepareAllDBClient, prepareDBClient } from './db-client'
export * from './ellapsed-time'
export * from './match-route'
export * from './wait-until'
export * from './use-window'
export const db: typeof dbImpl & { query: (sql: string) => Promise<any[]> } =
  prepareDBClient('main')
