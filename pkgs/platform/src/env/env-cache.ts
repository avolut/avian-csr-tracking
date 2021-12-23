import klaw from 'klaw'
import { waitUntil } from 'libs'
import { pathExists, readFile, writeFile } from 'libs/fs'
import type { Database } from 'lmdb'
import get from 'lodash.get'
import trim from 'lodash.trim'
import { basename, join } from 'path'
import { initPage } from 'src/routes/route-init'
import {
  initWindow,
  renderLayoutHtml,
  renderRootHtml,
  tryUpdateLayoutSSR,
} from 'src/routes/route-main-ssr'
import { Layout, Page, PlatformGlobal } from 'src/types'
import { findPage } from '../../../../pkgs/web/init/src/core/page/util'
import { BaseHtml } from '../../../../pkgs/web/init/src/start'
import { generateMobile } from './env-mobile'

declare const global: PlatformGlobal
export const cacheEnv = async () => {
  // global cache
  global.cache = {
    figma: { bgMaps: {}, imageMaps: {} },
    ssrstamp: {},
    public: {
      br: {},
      gz: {},
      raw: {},
    },
    index: '',
    db: {
      api: global.bundle.base.openDB('api', {
        compression: true,
        useVersions: false,
      }),
      page: global.bundle.base.openDB('page', {
        compression: true,
        useVersions: false,
      }),
      layout: global.bundle.base.openDB('layout', {
        compression: true,
        useVersions: false,
      }),
      component: global.bundle.base.openDB('component', {
        compression: true,
        useVersions: false,
      }),
    },
    layout: {},
    page: {},
    api: {},
    component: {},
  }

  reloadBaseCache()
  reloadComponentCache()
  generateIndexHTML().then(async () => {
    await generateMobile()
  })
}

const generateIndexHTML = async () => {
  await waitUntil(() => global.port)
  const url = '/'
  const init = await initPage()
  global.generateIndexHTML = { window: await initWindow(url) }

  if (init) {
    init.cms_id = '00000'

    const baseDir = global.buildPath.public
    const indexPath = join(baseDir, 'index.js')
    const starter = (await import(indexPath + '#' + global.assetStamp)) as {
      html: BaseHtml
      default: typeof ssr
    }

    global.hostname = global.generateIndexHTML.window.hostname

    const page = findPage(url, init.cms_pages as any)

    let layout = { html: '', css: '' }
    if (page && init.cms_layouts[page.lid]) {
      const layoutFound = global.cache.layout[page.lid]
      layout = await renderLayoutHtml({
        layout: layoutFound,
        init,
        page,
        window: global.generateIndexHTML.window,
      })
    }

    let { error, html } = await renderRootHtml({
      starter,
      init,
      url,
      window: global.generateIndexHTML.window,
    })

    delete global.generateIndexHTML

    if (!error) {
      if (layout.css) html = html.replace('</title>', `</title>${layout.css}`)

      if (layout.html)
        html = html.replace(
          '<div id="server-root"></div>',
          `<div id="server-root" data-ssr>${layout.html}</div>`
        )

      await writeFile(join(baseDir, 'index.html'), html)
    }
  }
}

const reloadComponentCache = () => {
  const db = global.bundle.base.openDB('component', {
    compression: true,
    useVersions: false,
  })

  for (let row of db.getRange({})) {
    if (typeof row.key === 'string') {
      const [compName, rowType] = row.key.split('|')
      if (!global.cache.component[compName]) {
        global.cache.component[compName] = { jsx: {} } as any
      }

      if (rowType === 'info') {
        const info = JSON.parse(row.value)
        for (let [k, v] of Object.entries(info)) {
          global.cache.component[compName][k] = v
        }
      } else {
        const component = global.cache.component[compName]
        if (component.jsx) {
          component.jsx[rowType] = row.value.toString('utf-8')
        }
      }
    }
  }
}

export const reloadSingleComponentCache = async (compName: string) => {
  const db = global.cache.db.component as Database

  if (db) {
    for (let rowType of ['map', 'raw', 'code', 'info'] as any) {
      const row = db.getEntry(`${compName}|${rowType}`)
      if (row) {
        if (!global.cache.component[compName]) {
          global.cache.component[compName] = { jsx: {} } as any
        }

        if (rowType === 'info') {
          const info = JSON.parse(row.value)
          for (let [k, v] of Object.entries(info)) {
            global.cache.component[compName][k] = v
          }
        } else {
          const component = global.cache.component[compName]
          if (component.jsx) {
            component.jsx[rowType] = row.value.toString('utf-8')
          }
        }
      }
    }
  }
}

export const reloadSingleBaseCache = async (type: string, file: string) => {
  const id = basename(file).substr(0, 5)

  const db = global.cache.db[type] as Database
  if (db) {
    let info = null as any
    for (let rowType of ['map', 'raw', 'code', 'info', 'jsx', 'api'] as any) {
      const entry = db.getEntry(`${id}|${rowType}`)
      if (entry) {
        if (rowType === 'info') {
          try {
            info = JSON.parse(entry.value)
          } catch (e) {}
        }
        _reloadSingleType(type, rowType, id, entry.value)
      }
    }
    if (!!info) {
      if (type === 'layout') {
        _reloadSingleInit('layout', { layout: global.cache.layout[info.id] })
      } else if (type === 'page') {
        for (let [url, item] of Object.entries(global.build.cms_pages)) {
          if (item.id === info.id) {
            delete global.build.cms_pages[url]
          }
        }
        _reloadSingleInit('page', { page: global.cache.page[info.id] })
      }
    }
  }
  process.stdout.write(' [DONE]\n')
}

const _reloadSingleType = (
  baseType: string,
  rowType: string,
  id: string,
  value: any
) => {
  const item = global.cache[baseType][id]
  if (item) {
    if (item.jsx) {
      if (rowType === 'code') {
        item.jsx.code = value
      } else if (rowType === 'map') {
        item.jsx.map = value
      } else if (rowType === 'raw') {
        item.jsx.raw = value
      }
    }
    if (rowType === 'info') {
      const info = JSON.parse(value)
      for (let [k, v] of Object.entries(info)) {
        item[k] = v
      }
    }
    if (rowType === 'api') {
      const source = value.toString('utf-8')
      global.bin.esbuild.transform(source, { loader: 'ts' }).then((sol) => {
        const solfunc = new Function(
          `this.serverOnLoad = ${trim(sol.code, ';')}`
        )
        solfunc.bind(item)()
      })
    }
  }
}

const _reloadSingleInit = (
  type: 'layout' | 'page',
  item: { page?: Page; layout?: Layout }
) => {
  if (type === 'page' && item.page) {
    const page = item.page
    global.build.cms_pages[page.url] = {
      id: page.id,
      lid: page.layout_id,
      url: page.url,
      sol: !!page.serverOnLoad,
    }
  } else if (type === 'layout' && item.layout) {
    const layout = item.layout
    global.build.cms_layouts[layout.id] = {
      id: layout.id,
      name: layout.name,
      source: layout.jsx?.code,
    }
  }
}

const reloadBaseCache = () => {
  global.build.cms_pages = {}
  ;['layout', 'page', 'api'].map((baseType) => {
    const db = global.cache.db[baseType]
    global.cache[baseType] = {}
    for (let row of db.getRange({})) {
      if (typeof row.key === 'string') {
        const [id, rowType] = row.key.split('|')
        if (!global.cache[baseType][id]) {
          global.cache[baseType][id] = { jsx: {} } as any
        }
        _reloadSingleType(baseType, rowType, id, row.value)
      }
    }
  })
  Object.entries(get(global, 'cache.page', {})).map((e) => {
    const page = e[1] as Page
    _reloadSingleInit('page', { page })
  })

  global.build.cms_layouts = {}
  Object.entries(get(global, 'cache.layout', {})).map((e) => {
    const layout = e[1] as Layout
    _reloadSingleInit('layout', { layout })
  })
}

export const reloadAsset = async () => {
  global.assets = {}
  if (global.cache) {
    global.cache.public.raw = {}
  }

  const stampFile = join(global.buildPath.public, 'build.timestamp')
  if (!(await pathExists(stampFile))) {
    await waitUntil(async () => await pathExists(stampFile))
  }

  global.assetStamp = await readFile(
    join(global.buildPath.public, 'build.timestamp'),
    'utf-8'
  )
  await new Promise((resolve) => {
    klaw(global.buildPath.public)
      .on('data', async (item) => {
        if (!item.stats.isFile()) return
        const path = item.path.substring(global.buildPath.public.length + 1)
        global.assets[path] = `/${path}`
      })
      .on('end', resolve)
  })
}
