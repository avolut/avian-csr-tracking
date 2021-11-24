import { join } from 'path'
import chalk from 'chalk'
import pad from 'lodash.pad'

const root = join(process.cwd())
const pkgs = join(root, 'pkgs')

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

export const clearScreen = () => {
  const readline = require('readline')
  const blank = '\n'.repeat(process.stdout.rows)
  console.log(blank)
  readline.cursorTo(process.stdout, 0, 0)
  readline.clearScreenDown(process.stdout)
}

export const dirs = {
  root,
  build: join(root, 'build'),
  app: {
    db: join(root, 'app', 'db'),
    web: join(root, 'app', 'web'),
    mobile: join(root, 'app', 'mobile'),
    server: join(root, 'app', 'server'),
  },
  pkgs: {
    boot: join(pkgs, 'boot'),
    main: join(pkgs, 'main'),
    dev: join(pkgs, 'dev'),
    figma: join(pkgs, 'figma'),
    libs: join(pkgs, 'libs'),
    web: join(pkgs, 'web'),
    builder: join(pkgs, 'builder'),
    platform: join(pkgs, 'platform'),
  },
}

export const log = (type, msg, newline = true) => {
  if (typeof type === 'boolean') {
    silent = !type
    return
  }

  if (silent) return

  const tstamp = new Date()
    .toISOString()
    .replace('T', ' ')
    .substring(0, 19)
    .split(' ')[1]
    .trim()
  const strtype = chalk.grey(
    `[ ${chalk.magenta(tstamp)} | ${pad(type, 9, ' ')}]`
  )
  const text = `${strtype} ${msg}${newline ? '\n' : ''}`

  if (newline && !lastLog.newline && lastLog.text.indexOf('\r') >= 0) {
    process.stdout.write('\n')
  }
  process.stdout.write(text)
  lastLog = { text, newline }
}

let silent = false

let lastLog = {
  text: '',
  newline: true,
}
