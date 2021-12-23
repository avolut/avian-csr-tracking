import { dirs } from 'boot'
import { build } from 'esbuild'
import trim from 'lodash.trim'
import { dirname, join } from 'path'
import { basename } from 'path/posix'
import { MainGlobal } from '../start'
export const cssFilesBuilt: any = {}

declare const global: MainGlobal

export const cssLoader = () => ({
  name: 'css-loader',
  setup: async function (build: any) {
    build.onResolve({ filter: /^loadStyle$/ }, () => {
      return { path: 'loadStyle', namespace: 'loadStyleShim' }
    })
    build.onLoad({ filter: /^loadStyle$/, namespace: 'loadStyleShim' }, () => {
      return {
        contents: `export function loadStyle(href) {  
        return new Promise(function (resolve, reject) {
          if (typeof window === 'undefined') {
            if (global)  {
              if (!global.cssLoader) {
                global.cssLoader = {}
              }
              const css = global.cssLoader;
              if (css) {
                css[href] = true
              }
            }
            return ;
          }
          const ex = document.querySelector(\`link[href="\${href}?${new Date().getTime()}"]\`);
          if (ex) ex.remove();
      
          let link = document.createElement("link");
          link.href = href;
          link.rel = "stylesheet";
      
          link.onload = () => resolve(link);
          link.onerror = () => reject(new Error(\`Style load error for \${href}\`));
      
          const title_node = document.querySelector('head > title')
          if (title_node && title_node.parentNode)
            title_node.parentNode.insertBefore(link, title_node.nextSibling)
        });
      }`,
      }
    })

    build.onLoad({ filter: /\.s?css$/ }, async (args: any) => {
      if (args.path === join(dirs.app.web, 'src', 'index.css')) {
        return {}
      }

      const buf = Buffer.from(args.path).toString('hex')
      const encodedPath = '/' + join('css', buf.substring(buf.length - 15))
      cssFilesBuilt[encodedPath] = await buildCss(args.path, encodedPath)

      return {
        contents: `
import {loadStyle} from 'loadStyle'
loadStyle(${cssFilesBuilt[encodedPath]})
        `.trim(),
        loader: 'js',
      }
    })
  },
})

const buildCss = (from: string, encodedPath: string) => {
  return new Promise(async (resolve) => {
    let topath = join(encodedPath, basename(from))

    await build({
      entryPoints: [from],
      bundle: true,
      minify: true,
      treeShaking: true,
      loader: {
        '.png': 'file',
        '.woff': 'dataurl',
        '.woff2': 'dataurl',
        '.eot': 'dataurl',
        '.ttf': 'dataurl',
        '.svg': 'file',
        '.gif': 'file',
        '.jpg': 'file',
        '.mp3': 'file',
      },
      outdir: dirname(join(dirs.build, 'public', topath)),
    })

    resolve(JSON.stringify(topath))
  })
}
