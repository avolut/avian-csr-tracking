/** @jsx jsx */
import { jsx } from '@emotion/react'
import {
  List,
  ListInput,
  ListItem,
  Navbar,
  NavRight,
  Link,
  Popup,
} from 'framework7-react'
import set from 'lodash.set'
import { useContext, useRef } from 'react'
import { createPortal } from 'react-dom'
import { useRender } from 'web-utils/src/useRender'
import { IBaseFieldProps } from '../../../../../ext/types/__form'
import { BaseList } from '../../../list/BaseList'
import { resolveValue } from './Minfo'

export const MSelect = ({ ctx, internalChange, name }: IBaseFieldProps) => {
  const form = useContext(ctx)
  const field = form.config.fields[name]
  const _ = useRef({
    list: {
      open: false,
    },
  })
  const meta = _.current

  if (!field) return null
  const state = field.state
  const render = useRender()

  const required = resolveValue({
    definer: state.required,
    args: [{ state: form, row: form.db.data, col: name }],
    render,
    default: false,
  })

  const mode = !!get(state, 'items.table') ? 'db' : 'array'
  const crud = (mode === 'db' ? state.items : null) as any

  return (
    <>
      <List
        className={`${required ? 'required' : ''} `}
        mediaList={mode === 'db'}
        css={
          mode === 'db' &&
          css`
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
          `
        }
      >
        {mode === 'array' ? (
          <ListInput
            label={state.title as any}
            placeholder={state.placeholder}
            required={required}
            value={state.value || ''}
            type={'select'}
            ref={
              ((e) => {
                if (e) {
                  const el = e.el as HTMLDivElement
                  const select = el.querySelector('select')
                  if (select) {
                    if (select.getAttribute('event-set') !== 'y') {
                      select.setAttribute('event-set', 'y')
                      select.addEventListener('change', (ev: any) => {
                        const value = ev.target.value
                        set(form.db.data, name, value)

                        if (typeof state.onChange === 'function')
                          state.onChange(value, {
                            state: form,
                            row: form.db.data,
                            col: name,
                          })
                        internalChange(value)
                      })
                    }
                  }
                }
              }) as any
            }
          >
            {Array.isArray(state.items) &&
              state.items.map(
                (e: string | { value: any; label: string }, idx) => (
                  <option value={typeof e === 'object' ? e.value : e} key={idx}>
                    {typeof e === 'object' ? e.label : e}
                  </option>
                )
              )}
          </ListInput>
        ) : (
          <ListItem
            link={'#'}
            title={state.title as any}
            className={`${state.error ? 'pb-4' : ''}`}
            subtitle={state.value || '—'}
            chevronCenter={true}
            disabled={state.readonly}
            onClick={() => {
              meta.list.open = true
              render()
            }}
          />
        )}
      </List>
      {crud && (
        <div className="hidden">
          <Popup
            opened={meta.list.open}
            css={css`
              z-index: 99999999;

              .list > ul {
                ::before,
                ::after {
                  display: none;
                }
              }
            `}
          >
            <div className="flex flex-1 w-full h-full flex-col">
              <Navbar
                backLinkShowText
                backLink="Back"
                onBackClick={() => {
                  meta.list.open = false
                  render()
                }}
                title={state.title as any}
              >
                <NavRight>
                  <Link
                    onClick={() => {
                      const value = null

                      if (crud.onSelect) {
                        crud.onSelect(null)
                      }
                      meta.list.open = false
                      set(form.db.data, name, value)

                      if (state && typeof state.onChange === 'function')
                        state.onChange(value, {
                          state: form,
                          row: form.db.data,
                          col: name,
                        })
                      internalChange(value)
                    }}
                  >
                    Clear
                  </Link>
                </NavRight>
              </Navbar>
              {meta.list.open && (
                <BaseList
                  title={state.title}
                  table={crud.table}
                  header={{ action: { create: false } }}
                  onRowClick={(row, idx, ev) => {
                    meta.list.open = false

                    if (crud.onSelect) {
                      crud.onSelect(row)
                    }

                    const value = crud.label(row)
                    set(form.db.data, name, value)

                    if (state && typeof state.onChange === 'function')
                      state.onChange(value, {
                        state: form,
                        row: form.db.data,
                        detail: row,
                        col: name,
                      })
                    internalChange(value)
                  }}
                  {...(crud.list || {})}
                />
              )}
            </div>
          </Popup>
        </div>
      )}
    </>
  )
}
