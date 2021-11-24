/** @jsx jsx */
import { jsx } from '@emotion/react'
import { Link, List, ListItem, Navbar, NavRight } from 'framework7-react'
import set from 'lodash.set'
import { useContext, useRef } from 'react'
import { createPortal } from 'react-dom'
import { useRender } from 'web-utils/src/useRender'
import { IBaseFieldProps } from '../../../../../ext/types/__form'
import { resolveValue } from './Minfo'

export const MCustomPopup = ({
  ctx,
  internalChange,
  name,
}: IBaseFieldProps) => {
  const _ = useRef({ open: false })
  const meta = _.current
  const form = useContext(ctx)
  const field = form.config.fields[name]
  const render = useRender()
  if (!field) return null
  const state = field.state
  const required = resolveValue({
    definer: state.required,
    args: [{ state: form, row: form.db.data, col: name }],
    render,
    default: false,
  })
  const popup = state.popup

  if (popup)
    return (
      <>
        <List
          className={`${required ? 'required' : ''} `}
          mediaList
          css={css`
            .item-text {
              font-size: var(--f7-input-info-font-size);
              position: relative;
              margin-top: -8px;
            }
            .item-title {
              font-size: var(--f7-label-font-size) !important;
              font-weight: var(--f7-label-font-weight) !important;
              line-height: var(--f7-label-line-height) !important;
              color: var(--f7-label-text-color) !important;
            }
            .item-subtitle {
              height: var(--f7-input-height);
              color: var(--f7-input-text-color);
              font-size: var(--f7-input-font-size);
              background-color: var(--f7-input-bg-color, transparent);
              padding-left: var(--f7-input-padding-left);
              padding-right: var(--f7-input-padding-right);
              display: flex;
              align-items: center;
            }
          `}
        >
          <ListItem
            link={'#'}
            title={popup.title as any}
            className={`${state.error ? 'pb-4' : ''}`}
            subtitle={popup.value({ state }) || '—'}
            chevronCenter={true}
            disabled={state.readonly}
            onClick={() => {
              meta.open = true
              render()
            }}
          />
        </List>
        {meta.open &&
          createPortal(
            <div
              className="fixed inset-0 flex flex-1 flex-col bg-white"
              css={css`
                z-index: 100000;
              `}
            >
              <Navbar
                backLinkShowText
                backLink="Back"
                onBackClick={() => {
                  meta.open = false
                  render()
                }}
                title={state.title as any}
              >
                <NavRight>
                  <Link
                    onClick={() => {
                      meta.open = false
                      render()
                    }}
                  >
                    OK
                  </Link>
                </NavRight>
              </Navbar>
              <div className="flex flex-1 overflow-auto items-stretch flex-col">
                {popup.children({
                  state,
                  onChange: (value: any) => {
                    set(form.db.data, name, value)
                    if (state && typeof state.onChange === 'function')
                      state.onChange(value, {
                        state: form,
                        row: form.db.data,
                        col: name,
                      })
                    internalChange(value)
                  },
                })}
              </div>
            </div>,
            document.getElementById('framework7-root') as any
          )}
      </>
    )
  return null
}
