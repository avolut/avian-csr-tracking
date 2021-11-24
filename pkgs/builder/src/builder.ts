import { dirs, log, modules } from 'boot'
import { build, BuildOptions, BuildResult, Platform, Plugin } from 'esbuild'
import { pathExists, readJSON } from 'fs-extra'
import { dirname, join } from 'path'
import { BuilderGlobal } from '.'
import { Watcher } from './watcher'

declare const global: BuilderGlobal

export interface IBuilderArgs {
  name?: string
  root: string
  in: string | string[]
  out?: string
  platform?: Platform
  buildOptions?: BuildOptions
  plugins?: any[]
  external?: string[]
  watch?: string[]
  onChange?: (event: string, path: string, builder?: Builder) => Promise<void>
  onBuilt?: (result: BuildResult, buildInfo?: any) => Promise<void>
}

export class Builder {
  _args?: any = {}
  root?: string = ''
  name?: string = '';
  in: string | string[] = ''
  out?: string = ''
  platform?: Platform = 'node'
  status?: 'building' | 'done' = 'building'
  external?: string[]
  plugins?: Plugin[]
  buildOptions?: BuildOptions
  process?: Promise<BuildResult>
  onMessage?: (msg) => Promise<void>
  onBuilt?: (result: BuildResult, buildInfo?: any) => Promise<void>

  watcher?: Watcher

  static async build(opt: Omit<Builder, 'build' | 'getDeps'>) {
    return build({
      entryPoints: Array.isArray(opt.in) ? opt.in : [opt.in],
      outfile: opt.out,
      platform: opt.platform,
      logLevel: 'silent',
      loader: {
        '.node': 'binary',
      },
      allowOverwrite: true,
      plugins: [...(opt.plugins || [])],
      bundle: true,
      define: {
        'process.env.NODE_ENV':
          global.mode === 'dev' ? '"development"' : '"production"',
      },
      external: opt.external,
      format: opt.platform === 'node' ? 'cjs' : 'esm',
      ...opt.buildOptions,
    })
  }

  async build(buildInfo?: any) {
    this.status = 'building'
    const external = [...(await this.getDeps()), ...modules]

    if (Array.isArray(this.external) && this.external.indexOf('...deps')) {
      this.external.splice(this.external.indexOf('...deps'), 1, ...external)
    }

    const finalExternal = [
      ...(this.external !== undefined ? this.external : external),
    ]
    const entry = Array.isArray(this.in) ? this.in : [this.in]
    const buildOpt = {
      entryPoints: entry,
      outfile: this.out,
      platform: this.platform,
      logLevel: 'silent',
      loader: {
        '.node': 'binary',
      },
      plugins: [...(this.plugins || [])],
      metafile: true,
      bundle: true,
      define: {
        'process.env.NODE_ENV':
          global.mode === 'dev' ? '"development"' : '"production"',
      },
      external: finalExternal,
      format: this.platform === 'node' ? 'cjs' : 'esm',
    } as BuildOptions

    if (this.buildOptions) {
      for (let [k, v] of Object.entries(this.buildOptions)) {
        buildOpt[k] = v
      }
    }

    try {
      this.process = build(buildOpt)
      const result = await this.process
      if (this.onBuilt) {
        await this.onBuilt(result, buildInfo)
      }

      this.status = 'done'

      return result
    } catch (e: any) {
      this.status = 'done'
      console.log('')
      log('error', `Failed to build pool.${this.name}:\n${e.message}`)
      return null
    }
  }

  private async getDeps(): Promise<string[]> {
    const pkg = join(
      dirname(Array.isArray(this.in) ? this.in[0] : this.in),
      '..',
      'package.json'
    )
    if (await pathExists(pkg)) {
      const json = await readJSON(pkg)
      if (json && json.dependencies) {
        return Object.keys(json.dependencies)
      }
    }
    return []
  }

  constructor(args: IBuilderArgs) {
    this._args = args
    for (let i in args) {
      ;(this as any)[i] = (args as any)[i]
    }
  }
}
