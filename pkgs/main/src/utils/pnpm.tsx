import { log } from 'boot'
import execa from 'execa'

export const runPnpm = async (
  args: string | any[] = '',
  opt?: { npx?: boolean; cwd?: string }
) => {
  log(
    'boot',
    `Running: ${opt?.npx ? 'pnpx' : 'pnpm'} ${(typeof args === 'string'
      ? args.split(' ')
      : args
    ).join(' ')}`
  )

  let command = 'pnpm'

  const runArgs = typeof args === 'string' ? args.split(' ') : args
  if (opt && opt.npx) {
    command = 'pnpx'
    runArgs.unshift('--yes')
    runArgs.unshift('--quiet')
  }

  const run = execa(command, runArgs, {
    all: true,
    stdout: 'inherit',
    cwd: opt ? opt.cwd : undefined,
    env: { FORCE_COLOR: 'true' },
  })

  run.all?.pipe(process.stdout)
  await run
  log('boot', `${command} [done]`)
}
