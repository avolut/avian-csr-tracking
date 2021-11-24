/** @jsx jsx */
import { css, jsx } from '@emotion/react'
import { createContext, useEffect } from 'react'
import { BaseWindow } from 'web-init/src/window'
import { useRender } from 'web-utils/src/useRender'
import { _figma } from './Figma'
import { init } from './figma/init'
import { Resizer } from './internal/Resizer'
import { FigmaTopBar } from './internal/TopBar'
declare const window: BaseWindow

const FigmaContext = createContext({} as typeof _figma)
FigmaContext.displayName = 'Figma'

export default () => {
  const render = useRender()

  useEffect(() => {
    init()
  }, [])

  useEffect(() => {
    const keydown = function (e) {
      if (
        (window.navigator.platform.match('Mac') ? e.metaKey : e.ctrlKey) &&
        e.keyCode == 83
      ) {
        e.preventDefault()
      }
    }
    document.addEventListener('keydown', keydown, false)

    return () => {
      document.removeEventListener('keydown', keydown)
    }
  }, [])

  _figma.main.render = render

  return (
    <FigmaContext.Provider value={_figma}>
      <div
        className="flex absolute inset-0 flex-col"
        css={css`
          .error {
            background: red;
            label {
              color: white !important;
              &.active {
                color: black !important;
              }
            }
          }
        `}
      >
        <Resizer>{_figma.main.init ? <FigmaTopBar /> : <div className="text-sm flex items-center justify-center flex-1">Loading...</div>}</Resizer>
      </div>
    </FigmaContext.Provider>
  )
}
