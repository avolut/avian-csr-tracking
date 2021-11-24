/** @jsx jsx */
import { css, jsx } from '@emotion/react'
import { MouseEvent, useEffect, useRef } from 'react'
import { _figma } from 'web-dev/src/Figma'
import { askFigma } from 'web-dev/src/figma/ask-figma'
import { useRender } from 'web-utils/src/useRender'
import get from 'lodash.get'
const handleSize = 8

const resizeW = (string) => css`
  width: ${handleSize}px;
  ${string}
`

const resizeH = css`
  height: ${handleSize}px;
`

export const Resizer = ({ children }) => {
  const _ = useRef({
    winw: 0,
    winh: 0,
    dragging: false as
      | false
      | { x: number; y: number; w: number; h: number; cursor: string },
  })

  const render = useRender()
  const meta = _.current
  const onMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    const cursor = getComputedStyle(e.currentTarget).cursor
    meta.dragging = {
      x: e.clientX,
      y: e.clientY,
      w: meta.winw,
      h: meta.winh,
      cursor,
    }
    render()
  }

  useEffect(() => {
    const size = localStorage.getItem('winsize')
    if (size) {
      const arr = size.split('x')
      meta.winw = parseInt(arr[0])
      meta.winh = parseInt(arr[1])
      askFigma((x) => figma.ui.resize(x.w, x.h), {
        w: meta.winw,
        h: meta.winh,
      }).then(() => {})
    }
  }, [])

  const error = get(_figma, 'current.frameTree.error')

  _figma.main.resizer.render = render
  return (
    <div
      className={`flex flex-1 absolute inset-0 flex-col ${
        error ? 'error' : ''
      }`}
      css={css`
        .handle:hover {
        }
      `}
    >
      <div className="flex" css={resizeH}>
        <div
          className="flex handle"
          onMouseDownCapture={onMouseDown}
          css={resizeW(`cursor: se-resize;`)}
        ></div>
        <div
          className="flex flex-1 handle"
          onMouseDownCapture={onMouseDown}
          css={resizeW(`cursor: s-resize;`)}
        ></div>
        <div
          className="flex handle"
          onMouseDownCapture={onMouseDown}
          css={resizeW(`cursor: sw-resize;`)}
        ></div>
      </div>
      <div className="flex flex-1">
        <div
          className="flex handle"
          onMouseDownCapture={onMouseDown}
          css={resizeW(`cursor: e-resize;`)}
        ></div>
        <div
          className="flex flex-1 items-stretch flex-col relative overflow-y-hidden border-gray-300 border"
          css={css``}
        >
          {children}
        </div>
        <div
          className="flex handle"
          onMouseDownCapture={onMouseDown}
          css={resizeW(`cursor: w-resize;`)}
        ></div>
      </div>
      <div className="flex" css={resizeH}>
        <div
          className="flex handle"
          onMouseDownCapture={onMouseDown}
          css={resizeW(`cursor: ne-resize;`)}
        ></div>
        <div
          onMouseDownCapture={onMouseDown}
          className="flex flex-1 handle"
          css={resizeW(`cursor: n-resize;`)}
        ></div>
        <div
          onMouseDownCapture={onMouseDown}
          className="flex handle"
          css={resizeW(`cursor: nw-resize;`)}
        ></div>
      </div>

      {meta.dragging && (
        <div
          className="absolute inset-0 bg-blue-100 opacity-60 "
          css={css`
            cursor: ${meta.dragging.cursor};
          `}
          onMouseMove={(e) => {
            const d = meta.dragging
            if (d) {
              const dx = d.x - e.clientX
              const dy = d.y - e.clientY
              meta.winw = Math.max(400, d.w - dx)
              meta.winh = Math.max(d.h - dy, 250)
              localStorage.setItem('winsize', `${meta.winw}x${meta.winh}`)
              askFigma((x) => figma.ui.resize(x.w, x.h), {
                w: meta.winw,
                h: meta.winh,
              })
            }
          }}
          onMouseLeave={() => {
            meta.dragging = false
          }}
          onMouseUp={() => {
            meta.dragging = false
          }}
        ></div>
      )}
    </div>
  )
}
