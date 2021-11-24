import { configure } from 'mobx'
import 'regenerator-runtime/runtime.js' // polyfill for old browser
import { defineCMS, detectPlatform, reloadAllComponents } from './core/platform'
import { defineWindow } from './core/window'
import { BaseWindow } from './window'
import { initHmr } from './initHmr'
configure({ enforceActions: 'never' })

declare const window: BaseWindow
window.global = {} as any

export const initApp = async (opt?: { Root?: any; notFoundURL?: string }) => {
  await Promise.all([
    await detectPlatform(), // window.platform
    await defineWindow(), // window.*
    await defineCMS(), // window.cms_*
  ])

  await reloadAllComponents()

  if (window.is_dev) {
    initHmr()
  }

  if (window.platform === 'web') {
    ;(await import('./web/web-init')).webInit()
  } else if (window.platform === 'mobile') {
    ;(await import('./mobile/mobile-init')).mobileInit()
  }
}
