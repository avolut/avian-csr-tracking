import { join } from 'path'
import { parentPort, Worker } from 'worker_threads'
import { dirs } from '../main'

export const startBase = async () => {
  if (parentPort) {
    while (await boot()) {}
  } else {
    base()
  }
}

const base = () => {
  return new Promise<Worker>((resolve) => {
    const args = process.argv.slice(2)
    const worker = new Worker(join(dirs.root, 'base.js'), {
      argv: args,
    })
    worker.addListener('message', async (msg) => {
      if (msg === 'restart') {
        worker.terminate()
      }
    })
    worker.addListener('exit', async (msg) => {
      base()
    })
    worker.postMessage('start')
  })
}

const boot = () => {
  return new Promise<Worker>((resolve) => {
    const args = process.argv.slice(2)

    const worker = new Worker(join(dirs.pkgs.boot, 'boot.js'), {
      argv: args,
    })
    worker.addListener('message', async (msg) => {
      if (msg === 'restart' && parentPort) {
        parentPort.postMessage('restart')
        worker.terminate()
      }
    })
    worker.addListener('exit', async (msg) => {
      resolve(worker)
    })
    worker.postMessage('start')
  })
}
