import { dirs, log } from 'boot'
import { BuildResult } from 'esbuild'
import { pathExists, readJSON, writeJSON, writeFile } from 'libs/fs'
import { dirname, join } from 'path'
import { Builder, IBuilderArgs } from './builder'
import { Runner } from './runner'
import { Watcher } from './watcher'
export class BuilderPool {
  public running: Record<string, Runner> = {}
  public builders: Record<string, Builder> = {}
  public watchers: Record<string, Watcher> = {}
  private _buildResult: Record<string, BuildResult | undefined> = {}
  private _onParentMessage = async (_: any) => {}

  status(name: string): false | 'building' | 'idle' | 'running' {
    if (!this.builders[name]) return false

    if (this.builders[name].status === 'building') {
      return 'building'
    }

    return this.running[name] ? 'running' : 'idle'
  }

  async destroy() {
    try {
      for (let [name, item] of Object.entries(this.watchers)) {
        if (item && item.stop) {
          await item.stop()
        }
        delete this.watchers[name]
      }

      for (let [name, item] of Object.entries(this.builders)) {
        if (item.process) {
          const process = await item.process
          if (process && process.stop) process.stop()
        }
        delete this.builders[name]
      }

      for (let [name, item] of Object.entries(this.running)) {
        await item.kill()
        delete this.running[name]
      }
    } catch (e) {
      console.log(`Failed to destroy buildpool. ${e}`)
    }
  }

  async add(
    name: string,
    args: IBuilderArgs & {
      skipBuild?: () => boolean
      metafile?: boolean
      onMessage?: (msg) => void
    }
  ) {
    if (name === 'main')
      throw new Error(
        `Failed to add new builder. Builder name cannot be "main".`
      )

    if (this.running[name]) {
      await this.running[name].kill()
      delete this.running[name]
    }

    let shouldAddWatcher = false
    if (args.onChange) {
      if (this.watchers[name]) {
        await this.watchers[name].stop()
      }
      if (args.watch) {
        this.watchers[name] = new Watcher(
          args.watch,
          args.onChange,
          this.builders[name]
        )
      } else {
        shouldAddWatcher = true
      }
    }
    const argsOnBuilt = args.onBuilt

    const outdir = dirname(args.out || '')
    let metafile = !!args.out ? join(outdir, 'build.meta.json') : ''
    if (args.metafile === false) {
      metafile = ''
    }

    const onBuilt: IBuilderArgs['onBuilt'] = async (result) => {
      if (metafile) {
        if (!args.skipBuild) {
          await writeJSON(metafile, result)
        }
      }

      if (shouldAddWatcher && result.metafile && args.onChange) {
        const dirs = Object.keys(result.metafile.inputs).filter(
          (e) => !e.startsWith('node_modules')
        )

        if (this.watchers[name]) {
          await this.watchers[name].stop()
        }
        this.watchers[name] = new Watcher(
          dirs,
          args.onChange,
          this.builders[name]
        )
      }

      if (result.errors.length > 0) {
        this._buildResult[name] = undefined
      } else {
        this._buildResult[name] = result
      }
      if (argsOnBuilt) {
        argsOnBuilt(result)
      }
    }
    args.onBuilt = onBuilt

    // adding existing builder will rebuild it.
    // do not start build when it's still building
    if (
      !this.builders[name] ||
      (this.builders[name] && this.builders[name].status === 'done')
    ) {
      this.builders[name] = new Builder({ ...args, name })
      if (metafile && (await pathExists(metafile))) {
        try {
          const result = await readJSON(metafile)
          this.builders[name].status = 'done'
          onBuilt(result)
        } catch (e) {
          await this.builders[name].build()
        }
      } else {
        if (args.skipBuild && args.skipBuild()) {
          return
        }
        await this.builders[name].build()
      }
    }
  }

  async rebuild(name: string, buildInfo?: any) {
    if (this.status(name) !== 'building') {
      if (this.running[name]) {
        await this.running[name].kill()
      }

      const buildres = this._buildResult[name]

      if (this.builders[name]) {
        if (buildres && buildres.rebuild) {
          const result = await buildres.rebuild()
          const onBuilt = this.builders[name].onBuilt
          if (onBuilt) {
            onBuilt(result)
          }
          return result
        } else {
          return await this.builders[name].build(buildInfo)
        }
      }
    }
  }

  async send(name: string, data: any): Promise<false | any> {
    if (name === 'main') {
      return await this._onParentMessage(data)
    } else {
      const run = this.running[name]
      if (run) {
        return await run.send(data)
      }
      return false
    }
  }

  onParentMessage(func: (msg: any) => Promise<any>) {
    this._onParentMessage = func
  }

  run(name: string, args?: any): Runner {
    const builder = this.builders[name]
    if (builder && builder.out) {
      const runner = new Runner(name, builder.out, this, args)

      this.running[name] = runner
      return runner
    }

    throw new Error(
      `Failed to run. builder ${name} does not exists. \n Available builders are: ${Object.keys(
        this.builders
      ).join(', ')}`
    )
  }
}
