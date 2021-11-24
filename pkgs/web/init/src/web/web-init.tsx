import React, { lazy, Suspense } from 'react'
import { render } from 'react-dom'
import { injectCSS } from '../../../utils/src/inject'
import { BaseWindow } from '../window'
import { WebMain } from './web-main'

declare const window: BaseWindow
export const webInit = async () => {
  await injectCSS('/index.css')

  switch (true) {
    case window.is_dev && location.pathname.indexOf('/figma') === 0:
      {
        const Figma = lazy(() => import('../../../dev/src/DevFigma'))
        render(
          <Suspense fallback={null}>
            <Figma />
          </Suspense>,
          document.getElementById('root')
        )
      }
      break
    default:
      render(<WebMain />, document.getElementById('root'))
  }
}
