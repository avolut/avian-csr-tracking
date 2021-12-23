import { log } from 'boot'
import { pathExists, readFile, rename, writeFile } from 'libs/fs'
import { snakeCase, trim } from 'lodash-es'
import { join } from 'path'
import { Layout, Page } from '../../../../platform/src/types'
import { preProcessJSX } from './page-compiler'

export const pageJSXNameMap = {}

export const reloadSinglePage = async (pageID: string, pagePath: string) => {
  let jsonFile = pageID.endsWith('.json') ? pageID : pageID + '.json'
  const source = await readFile(join(pagePath, jsonFile), 'utf-8')

  try {
    const page: Page = JSON.parse(source)

    if (page) {
      const name = pageJSXNameMap[page.id]
      if (typeof name !== undefined) {
        const pageName = '-' + snakeCase(page.name).replace(/_/gi, '-')
        if (name !== page.name) {
          if (
            await pathExists(join(pagePath, `${page.id}${name || ''}.base.tsx`))
          ) {
            await rename(
              join(pagePath, `${page.id}${name || ''}.base.tsx`),
              join(pagePath, `${page.id}${pageName}.base.tsx`)
            )
          } else {
            await writeFile(
              join(pagePath, `${page.id}${pageName}.base.tsx`),
              `;<>
    <effect meta={{}} run={async () => {}} />
    <div></div>
  </>`
            )
          }

          pageJSXNameMap[page.id] = pageName
        }
      }
    } else {
      console.log(page)
    }
  } catch (e: any) {
    console.log('')
    log('error', `Failed to load page: app/web/src/base/page/${jsonFile} `)
    console.log(e)
  }
}

export const prepPageJsx = (page: Page, jsx: string) => {
  try {
    const { meta, code, use_mobx } = preProcessJSX(page, jsx)
    return `
  // page: ${page.id} | layout: ${page.layout_id} | url: ${page.url}
  if (window.cms_pages['${page.url}']) {
    window.cms_pages['${page.url}'].render = function (
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
      base
    ) {
       ${trim(code.trim(), ';').trim().replace('base(', 'return base(')}
    }
    window.cms_pages['${page.url}'].render.use_mobx = ${
      use_mobx ? 'true' : 'false'
    };
    window.cms_pages['${page.url}'].render.child_meta = ${meta};
  }`
  } catch (e: any) {
    process.stdout.write('\n')
    log(
      'error',
      `ERROR: app/web/src/base/page/${page.id}.base.tsx | ${page.name}`
    )
    log('error', e.message)
  }
}

export const prepLayoutJsx = (layout: Layout, jsx: string) => {
  try {
    const { meta, code, use_mobx } = preProcessJSX(layout, jsx)
    return `
// layout: ${layout.id} | name: ${layout.name}
if (window.cms_layouts['${layout.id}']) {
  window.cms_layouts['${
    layout.id
  }'].running = { cache: null, init: false, mobx: {} };
  window.cms_layouts['${layout.id}'].render = function (
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
    base,
    children
  ) {
    ${trim(code.trim(), ';').trim().replace('base(', 'return base(')}
  }
  
  window.cms_layouts['${layout.id}'].render.use_mobx = ${
      use_mobx ? 'true' : 'false'
    };
  window.cms_layouts['${layout.id}'].render.child_meta = ${meta};
}`
  } catch (e: any) {
    process.stdout.write('\n')
    log(
      'error',
      `ERROR: app/web/src/base/layouts/${layout.id}.base.tsx | ${layout.name}`
    )
    log('error', e.message)
  }
}
