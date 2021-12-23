import { transformAsync, TransformOptions } from 'libs/babel'
import trim from 'lodash.trim'
export const compileSingleComponent = async (
  name: string,
  jsx: string,
  modernBrowser = false
) => {
  const transformOpt: TransformOptions = {
    minified: true,
    sourceMaps: true,
    presets: [
      [
        '@babel/preset-react',
        {
          pragma: 'h',
          pragmaFrag: 'fragment',
        },
      ],
      [
        '@babel/env',
        {
          targets: {
            browsers: [modernBrowser ? 'defaults' : 'Chrome <= 45'],
          },
          useBuiltIns: 'entry',
          corejs: { version: '3.8', proposals: true },
        },
      ],
      [
        '@babel/preset-typescript',
        {
          isTSX: true,
          allExtensions: true,
          jsxPragma: 'h',
          jsxPragmaFrag: 'fragment',
          allowNamespaces: true,
        },
      ],
    ],
  }

  jsx = trim(jsx, ';')
  jsx = `\
const ccx_component = (__extract) => {
  const __render__ = (
db, 
api,
action,
runAction,
h,
fragment,
row,
layout,
user,
params, 
css,
meta,
base) => { 
    return ${jsx};
  }
  __render__.__extract = __extract
  const [_, setRender] = useState({})

  let win = null;
  if (typeof window === 'undefined') {
    if (global && global.requestContext) {
      win = global.requestContext.get('window')
    }
  } else{
    win = window
  }
  if (win) {
    let result = {
      page: jsx('fragment', null, null),
      effects: new Set(),
    }
    try {
      result = win.renderCMS(
        __render__, 
        typeof meta === 'undefined' ? {} : meta,
        { 
          defer: false, 
          type: 'component',
          params
        }
      )

    } catch (e) {
      console.error(__render__, e)
      result = {
        page: jsx('pre', {className:"p-4 text-red-500"},e + ''),
        effects: new Set(),
      }
    }

    if (result) { 
      if (result.loading) {
        result.loading().then(() => {
          setRender({})
          if (!win.isSSR) {
            // win.showClientRoot('first component loaded')
          }
        })
      } 
      
      return result.page;
    }
  }
  return () => jsx('pre', {className:"p-4 text-red-500"},'Render Failed')
}`

  const result = await transformAsync(
    `${jsx.replace(/<!--([\s\S])*?-->/g, '')}`,
    transformOpt
  )

  let code = result?.code || ''
  if (code && code.startsWith('"use strict";')) {
    code = code.substr('"use strict";'.length)
  }

  if (result && result.map) result.map.sources[0] = `/__component/${name}.js`
  return {
    code,
    map: JSON.stringify(result?.map),
  }
}
