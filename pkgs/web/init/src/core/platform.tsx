import { useWindow, waitUntil } from 'libs'
import { renderCMS } from './internal/render'

export const reloadAllComponents = async () => {
  const { window } = useWindow()
  if (!window.isSSR) {
    window.cms_components = {}
  }

  let final = (await import('../../../../../app/web/src/external')).default
  if (window.platform === 'mobile') {
    const { extendExternals } = await import('../mobile/mobile-ext')
    final = { ...final, ...extendExternals() }
  }

  for (let [tag, v] of Object.entries(final)) {
    if (window.cms_components[tag]) continue

    window.cms_components[tag] = {
      component: () => <></>,
      template: {
        loading: false,
        code: '',
      },
      load: v as any,
      loading: false,
      loaded: false,
    }
  }
}

export const detectPlatform = async () => {
  const { window } = useWindow()
  if (!window.platform) {
    window.platform = 'web'
    if (
      location &&
      (location.pathname === '/m' || location.pathname.indexOf('/m/') === 0)
    ) {
      window.platform = 'mobile'
    } else if (
      location &&
      (location.pathname === '/w' || location.pathname.indexOf('/w/') === 0)
    ) {
      window.platform = 'web'
    } else {
      if (document.body.clientWidth <= 768) {
        window.platform = 'mobile'
      }
    }

    if (location.pathname.indexOf('/figma') === 0) {
      window.platform = 'web'
    }
  }
}
