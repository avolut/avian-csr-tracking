import { waitUntil } from 'libs'
import { Unpackr } from 'msgpackr/unpack'
import { BaseWindow } from '../window'

declare const window: BaseWindow
export const unpackBase = async () => {
  await waitUntil(() => window.cms_base_pack)

  if (window.cms_base_pack) {
    const unpackr = new Unpackr({})
    const result = unpackr.unpack(new Uint8Array(window.cms_base_pack))

    for (let [k, v] of Object.entries(result) as any) {
      if (k === 'user') {
        try {
          window[k] = JSON.parse(v)
        } catch (e) {
          console.error('Failed to parse user session')
        }
      } else {
        window[k] = v
      }
    }
  }
}
