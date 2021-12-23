/** @jsx jsx */
import { css, jsx } from '@emotion/react'
import { Button, Searchbar } from 'framework7-react'
import { Context, isValidElement, useContext, useEffect, useRef } from 'react'
import { BaseWindow } from 'web-init/src/window'
import { useRender } from 'web-utils/src/useRender'
import { ICRUDContext } from '../../../../ext/types/__crud'
import { IBaseListContext } from '../../../../ext/types/__list'
import { lang } from '../../lang/lang'

declare const window: BaseWindow

export const BaseFilterMobile = ({
  ctx,
}: {
  ctx: Context<IBaseListContext>
}) => {
  const _ = useRef({
    init: false,
  })

  const state = useContext(ctx)
  const meta = _.current
  const render = useRender()
  useEffect(() => {
    const firstCol = state.table.columns[0]
    if (firstCol) {
      if (!state.db.params) {
        state.db.params = {}
      }
      if (!state.db.params.where) {
        state.db.params.where = {} as any
      }

      const where = state.db.params.where
      if (where[firstCol] && where[firstCol].contains) {
        state.filter.quickSearch = where[firstCol].contains
      }
    }
    meta.init = true
    render()
  }, [])

  if (!meta.init) return null

  const canCreate = state.header?.action?.create
  let create = null as any
  if (canCreate !== false) {
    if (typeof canCreate === 'function') {
      create = canCreate({ state, save: null, data: null })
    } else if (typeof create === 'object') {
      if (isValidElement(canCreate)) {
        create = canCreate
      } else {
        create = (
          <Button
            raised
            large
            onClick={() => {
              const parent = state.tree.parent as ICRUDContext
              parent.crud.setMode('form', {})
              parent.component.render()
            }}
            className="flex flex-row items-center"
            css={css`
              margin: 10px 0px 10px 5px;
              width: 120px;
              border-radius: 5px;
              height: 30px;
              line-height: 30px;
            `}
            children={
              <>
                <span
                  css={css`
                    font-size: 22px;
                    line-height: 0px;
                    margin-top: -4px;
                  `}
                >
                  +
                </span>
                <span
                  css={css`
                    font-size: 14px;
                    text-transform: initial;
                  `}
                >
                  {typeof state.header?.action?.create === 'string'
                    ? state.header.action.create
                    : lang('Tambah', 'id')}
                </span>
              </>
            }
            {...((typeof create === 'object' && !isValidElement(create)
              ? create
              : {}) as any)}
          />
        )
      }
    }
  }
  return (
    <>
      <Searchbar
        onClickClear={() => {
          state.filter.quickSearch = ''
          render()
          state.component.render()
        }}
        value={state.filter.quickSearch || ''}
        searchContainer=".search-list"
        searchIn=".item-link"
        placeholder={`${state.filter.quickSearchTitle || 'Cari'}`}
        disableButton={false}
        clearButton={true}
        css={css`
          .searchbar-input-wrap input {
            border-radius: 5px !important;
          }
        `}
        onChange={(e) => {
          const text = e.target.value
          const firstCol = state.table.columns[0]
          if (firstCol) {
            if (!state.db.params.where) {
              state.db.params.where = {} as any
            }

            const where = {}

            if (text) {
              where[firstCol] = {
                contains: text,
                mode: 'insensitive',
                found: false,
              }
            } else {
              delete where[firstCol]
            }

            if (state.table.columns[1]) {
              const secondCol = state.table.columns[1]

              if (text) {
                where[secondCol] = {
                  contains: text,
                  mode: 'insensitive',
                  found: false,
                }
              } else {
                delete where[secondCol]
              }
            }

            let or = state.db.params.where.OR
            if (!or) {
              state.db.params.where.OR = []
              or = state.db.params.where.OR
            }

            for (let orCol of or) {
              for (let [k, v] of Object.entries(orCol)) {
                if (where[k]) {
                  where[k].found = true
                }
              }
            }

            for (let [k, v] of Object.entries(where) as any) {
              delete v.found
              or.push({ [k]: v })
            }

            state.db.paging.reset()
            state.filter.quickSearch = text
            state.db.query()
          } else {
            state.filter.quickSearch = text
            render()
            state.component.render()
          }
        }}
      >
        {create}
      </Searchbar>
    </>
  )
}

export const searchObject = (row: any, text: string) => {
  let found = false
  for (let [k, v] of Object.entries(row) as any) {
    if (v && v.toString && v.toString().toLowerCase().indexOf(text) >= 0) {
      found = true
      break
    }
    if (typeof v === 'object' && !!v && !k.startsWith('_')) {
      if (searchObject(v, text)) {
        found = true
        break
      }
    }
  }

  return found
}
