import { dirs, log } from 'boot'
import { readFile } from 'fs/promises'
import padEnd from 'lodash.padend'
import trim from 'lodash.trim'
import { basename, join } from 'path'
import { publicBundle } from 'src/bundler/public/public'
import { ellapsedTime } from '../../../libs/src/ellapsed-time'
import { MainGlobal } from '../start'
export const cssFilesBuilt: any = {}

declare const global: MainGlobal

export const cssLoader = () => ({
  name: 'css-loader',
  setup: async function (build: any) {
    if (!global.twconf) {
      global.twconf = await readFile(
        join(dirs.app.web, 'tailwind.config.js'),
        'utf-8'
      )
    }

    build.onResolve({ filter: /^loadStyle$/ }, () => {
      return { path: 'loadStyle', namespace: 'loadStyleShim' }
    })
    build.onLoad({ filter: /^loadStyle$/, namespace: 'loadStyleShim' }, () => {
      return {
        contents: `export function loadStyle(href) {  
        return new Promise(function (resolve, reject) {
          const ex = document.querySelector(\`link[href="\${href}?${new Date().getTime()}"]\`);
          if (ex) ex.remove();
      
          let link = document.createElement("link");
          link.href = href;
          link.rel = "stylesheet";
      
          link.onload = () => resolve(link);
          link.onerror = () => reject(new Error(\`Style load error for \${href}\`));
      
          document.head.append(link);
        });
      }`,
      }
    })

    build.onLoad({ filter: /\.s?css$/ }, async (args: any) => {
      if (args.path == join(dirs.app.web, 'src', 'index.css')) {
        return {}
      }

      const time = new Date().getTime()
      cssFilesBuilt[args.path] = await buildCss(args.path)

      return {
        contents:
          args.path.indexOf('index.css') > 0
            ? ''
            : `
import {loadStyle} from 'loadStyle'
loadStyle(${cssFilesBuilt[args.path]})
        `.trim(),
        loader: 'js',
      }
    })
  },
})

const buildCss = (from: any) => {
  return new Promise(async (resolve) => {
    const srcpath = join(dirs.root, 'app', 'web', 'src')
    const nodepath = join(dirs.root, 'node_modules')
    const buildpath = join(dirs.app.web, 'build', 'web')
    let topath = ''

    if (from.indexOf(srcpath) === 0) {
      topath =
        '/' + trim(from.substr(srcpath.length + 1).replace(/\\/g, '/'), '/', {})
    } else if (from.indexOf(nodepath) === 0) {
      topath =
        '/node/' +
        trim(from.substr(nodepath.length + 1).replace(/\\/g, '/'), '/', {})
    } else if (from.indexOf(dirs.pkgs.web) === 0) {
      topath =
        '/pkgs/web/' +
        trim(from.substr(dirs.pkgs.web.length + 1).replace(/\\/g, '/'), '/', {})
    }

    const content = await readFile(from)
    publicBundle.db.items.raw.public.put(topath, content)
    publicBundle.db.compressSingle('public', topath, content)
    resolve(JSON.stringify(topath))
  })
}
