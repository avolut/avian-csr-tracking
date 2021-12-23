/** @jsx jsx */
import { jsx } from '@emotion/react'
import { createRoot } from 'react-dom'
import React from 'react'
import { Main } from './content/main'
import { initFluent } from '../../web/init/src/web/initFluent'
import {} from '../../web/init/src/core/window'
import { BaseWindow } from '../../web/init/src/window'
declare const window: BaseWindow

window.platform = 'web'
window.React = React

const el = document.getElementById('root')
if (el) {
  initFluent().then(() => {
    const root = createRoot(el)
    root.render(<Main />)
  })
}
