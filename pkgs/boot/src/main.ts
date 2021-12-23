import * as logging from './utils/logging'

export const modules = [
  'boot',
  'builder',
  'main',
  'platform',
  'web',
  'server',
  'db',
  'mobile',
]

export const hlog = logging.hlog
export const timelog = logging.timelog
export const log = logging.log
export const clearScreen = logging.clearScreen
export const dirs = logging.dirs
