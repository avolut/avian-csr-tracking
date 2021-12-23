import { useWindow } from 'libs'
import pako from 'pako'

const lastCallback = {
  connect: null as any,
  disconnect: null as any,
  receive: null as any,
}

export const initHmr = () => {
  const { window } = useWindow()
  for (let i of Object.keys(localStorage)) {
    if (
      i.indexOf('csx-') === 0 ||
      i.indexOf('ccx-') === 0 ||
      i.indexOf('dbdef-') === 0
    ) {
      localStorage.removeItem(i)
    }
  }

  window.ws_dev = new WebSocket(
    `ws://${location.hostname}:${location.port}/__hmr`
  ) as any
  const ws = window.ws_dev
  if (ws) {
    ws.packAndSend = (msg: any) => {
      ws.send(pako.deflate(JSON.stringify(msg)))
    }
    ws.onConnected = () => {
      // console.clear()
      console.log('[HMR] Welcome to Base')
    }

    if (lastCallback && lastCallback.connect) {
      ws.onConnected = lastCallback.connect as any
    }
    if (lastCallback && lastCallback.receive) {
      ws.onReceive = lastCallback.receive as any
    }
    if (lastCallback && lastCallback.disconnect) {
      ws.onDisconnected = lastCallback.disconnect as any
    }

    ws.onopen = async () => {
      if (ws && ws.onConnected) {
        ws.onConnected(ws)
      }
    }
    ws.onclose = async () => {
      console.log('[HMR] Disconnected, retrying...')

      if (ws) {
        if (ws.onConnected) lastCallback.connect = ws.onConnected

        if (ws.onReceive) lastCallback.receive = ws.onReceive

        if (ws.onDisconnected) lastCallback.disconnect = ws.onDisconnected
      }

      if (ws.onDisconnected) {
        ws.onDisconnected(ws)
      }
      if (ws.readyState !== 1) {
        setTimeout(() => {
          if (ws.readyState !== 1) initHmr()
        }, 1000)
      }
    }
    ws.onmessage = async (e) => {
      const msg = JSON.parse(e.data)

      if (ws.onReceive) {
        ws.onReceive(e, ws)
      }

      switch (msg.type) {
        case 'platform-answer':
          {
            let data = undefined
            try {
              if (typeof msg.data === 'string') {
                data = JSON.parse(msg.data)
              }
            } catch (e) {}
            if (window.devAskPlatform) {
              window.devAskPlatform.answers[msg.id || ''](data)
              delete window.devAskPlatform.answers[msg.id || '']
            }
          }
          break
        case 'hmr-pending-reload-all':
          {
            const root = document.getElementById('root')
            if (root) {
              root.classList.add(
                'cursor-wait',
                'transition-opacity',
                'opacity-50'
              )
              document.body.style.background = `linear-gradient(145deg, #f5f5f5 25%, #d8e4fc 25%, #d8e4fc 50%, #f5f5f5 50%, #f5f5f5 75%, #d8e4fc 75%, #d8e4fc 100%)`
              document.body.style.backgroundSize = `69.74px 48.83px`
              console.log('[HMR] Reloading Page')
            }
          }
          break
        case 'hmr-reload-page':
          if (msg.id === window.cms_id) {
            if (window.cms_pages[msg.url]) {
              // console.clear()
              // window.liveReloadPage()
            }
          } else if (msg.id === (window as any).cms_layout_id) {
            // console.clear()
            // window.liveReloadLayout()
          }
          break
        case 'hmr-reload-app':
          if (location.pathname !== '/figma') {
            location.reload()
          }
          break
        case 'hmr-reload-all':
          location.reload()
          break
        case 'component-reload':
          localStorage[`ccx-${msg.id}`] = msg.html
          window.cms_components[msg.id].loaded = false
          // window.liveReloadPage()
          break
      }
    }
  }
}
