/** @jsx jsx */
import { css, jsx } from '@emotion/react'
import { _figma } from 'src/Figma'
import PureSelect from 'web-crud/src/form/web/fields/PureSelect'
import { useRender } from 'web-utils/src/useRender'
export const FigmaTopBar = () => {
  const render = useRender()
  _figma.main.topbar.render = render
  return (
    <div
      className="flex select-none items-stretch border-b justify-between border-gray-300 "
      css={css`
        font-size: 12px;
        height: 23px;
        .btn {
          color: #666;
          padding: 0px 6px;
          display: flex;
          user-select: none;
          align-items: center;
          cursor: pointer;

          i {
            font-size: 10px;
            font-weight: bold;
            margin-right: 2px;
            height: 12px;
            width: 12px;
          }

          &:hover {
            text-decoration: underline;
          }
        }

        .pure-select {
          max-width: 70px;
          > i {
            display: none;
          }
          .ms-TextField,
          input,
          .ms-TextField-wrapper,
          .ms-TextField-fieldGroup {
            border: 0px;
            max-height: 20px;
            font-size: 13px;
            text-align: center;
          }
          .ms-TextField-fieldGroup::after {
            display: none;
          }
        }
      `}
    >
      <div className="flex flex-1 left">
        <PureSelect
          css={css`
            border-right: 1px solid #ececeb;
          `}
          value="+ New"
          onChange={() => {}}
          items={['+ New', '+ Page', '+ Frame']}
        />
        {_figma.current.frame && (
          <PureSelect
            css={css`
              border-right: 1px solid #ececeb;
            `}
            value="Web"
            onChange={() => {}}
            items={['Web', 'Mobile']}
          />
        )}
      </div>
      <div className="flex flex-1 items-stretch justify-end right">
        <div
          className="flex items-center"
          css={css`
            padding: 0px 10px;
            border-left: 1px solid #ececeb;
          `}
        >
          <input
            value={_figma.main.topbar.zoom}
            onChange={(e) => {
              const val = parseInt(e.target.value.replace(/\D/g, ''))

              _figma.main.topbar.zoom = val
              render()
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.currentTarget.blur()
              }
            }}
            onBlur={(e) => {
              const val = parseInt(e.target.value.replace(/\D/g, ''))

              if (val > 0 && val <= 100) {
                _figma.main.topbar.zoom = val
              } else {
                _figma.main.topbar.zoom = 100
              }

              render()
            }}
            css={css`
              width: 30px;
            `}
          />
          %
        </div>
      </div>
    </div>
  )
}
