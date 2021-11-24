import { dirs, clearScreen } from '../main'
import chalk from 'chalk'

export const EXECA_FULL_COLOR = {
  stdout: 'inherit',
  cwd: dirs.root,
  all: true,
  env: { FORCE_COLOR: 'true' },
} as any

export const logo = () => {
  return chalk.gray(
    `[ ${chalk.bold(`    ANDRO ${chalk.green('Base')}`)}      ]`
  )
}

export const welcomeToBase = (mode: 'dev' | 'prod', port: number) => {
  clearScreen()

  console.log(
    logo() +
      ` ${
        mode === 'dev'
          ? `Development [Port ${port}]`
          : `Production [Port ${port}]`
      }`
  )
}
