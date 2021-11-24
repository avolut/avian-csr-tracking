/** @jsx jsx */
import { jsx } from '@emotion/react'
import {
  List,
  ListItem,
  SwipeoutActions,
  SwipeoutButton,
} from 'framework7-react'
import { db, waitUntil } from 'libs'
import { useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { BaseWindow } from 'web-init/src/window'
import { IBaseListContext } from '../../../../../ext/types/__list'
import { columnized } from '../BaseListMobile'

declare const window: BaseWindow
export const MobileList = ({
  columns,
  state,
  meta,
  render,
  items,
}: {
  columns: IBaseListContext['table']['columns']
  state: IBaseListContext
  meta: any
  items: any[]
  render: () => void
}) => {
  const listRef = useRef(null as any)
  useEffect(() => {
    const el = listRef.current
    if (el && !el.onscroll) {
      el.onscroll = async (e: Event) => {
        const div = e.target as HTMLDivElement
        const scrollPercent = (div.scrollTop / div.scrollHeight) * 100
        if (scrollPercent > 60 && state.db.loading === false) {
          let sc = div.scrollTop
          await state.db.paging.loadNext()
          div.scrollTop = sc
        }
      }
    }
  }, [listRef.current])
  return (
    <div
      ref={listRef}
      className="absolute inset-0 flex flex-col overflow-y-auto"
    >
      {listRef.current && (
        <List
          mediaList={Array.isArray(columns) && columns.length > 1}
          virtualList
          virtualListParams={{
            items: items,
            scrollableParentEl: listRef.current,
          }}
        >
          {state.table.mobile.swipeout !== false &&
            window.mobileListHideInfo !== false && (
              <div
                className={
                  'flex justify-end text-xs opacity-50 p-2 pr-6 transition-all ' +
                  (meta.hideInfo === true ? ' h-0 py-0' : '')
                }
                onClick={() => {
                  meta.hideInfo = true
                  setTimeout(() => {
                    window.mobileListHideInfo = true
                  }, 1000)
                  render()
                }}
              >
                <div className="text-right whitespace-pre-wrap">
                  {`Geser baris data dari kanan ke kiri \nuntuk opsi tambahan`}
                </div>
                <img
                  src="/__ext/icons/swirly-arrow.svg"
                  width="30"
                  className="ml-3"
                />
              </div>
            )}
          {items.map((row, idx) => {
            const EditButton = () => {
              return (
                <SwipeoutButton
                  color="blue"
                  onClick={(ev) => {
                    if (state.table.onRowClick)
                      state.table.onRowClick(row, idx, ev, state)
                  }}
                >
                  Edit
                </SwipeoutButton>
              )
            }
            const DeleteButton = () => {
              return (
                <SwipeoutButton
                  overswipe
                  confirmTitle="Konfirmasi"
                  confirmText="Apakah Anda yakin akan dihapus?"
                  delete
                >
                  Hapus
                </SwipeoutButton>
              )
            }

            const swipeout =
              state.table.mobile.swipeout !== false ? (
                <SwipeoutActions right>
                  {typeof state.table.mobile.swipeout === 'function' ? (
                    state.table.mobile.swipeout(row, {
                      Swipe: SwipeoutButton,
                      Edit: EditButton,
                      Delete: DeleteButton,
                    })
                  ) : (
                    <DeleteButton />
                  )}
                </SwipeoutActions>
              ) : null

            const content =
              typeof columns === 'function'
                ? columns({
                    list: state.db.list,
                    state,
                    index: idx,
                    row: row,
                  })
                : {
                    title: columnized(columns[0], row, state),
                    subtitle: columnized(columns[1], row, state) + '',
                    text: columnized(columns[2], row, state),
                    after: columnized(columns[3], row, state),
                  }

            if (typeof columns === 'function') {
              if (
                row.__listMeta &&
                row.__listMeta.f7el &&
                !row.__listMeta.f7row
              ) {
                row.__listMeta.f7row = createPortal(
                  content,
                  row.__listMeta.f7el
                )
              }
            }

            const onSwipeoutDeleted = state.table.mobile.onSwipeoutDeleted
              ? async () => state.table.mobile.onSwipeoutDeleted(row)
              : async () => {
                  if (state.db.definition) {
                    state.db.loading = true
                    render()
                    await db[state.db.tableName].delete({
                      where: {
                        [state.db.definition.pk]: row[state.db.definition.pk],
                      },
                    })

                    state.db.loading = false
                    render()
                  }
                }

            if (!state.table.mobile.checked) {
              state.table.mobile.checked = {}
            }
            const checked = state.table.mobile.checked
            const pk = state.db.definition ? row[state.db.definition.pk] : ''

            console.log(pk, checked)
            return (
              <ListItem
                link={true}
                noChevron={true}
                key={idx}
                checked={!!(pk && checked[pk])}
                checkbox={!!get(state, 'table.mobile.checkbox')}
                onClick={(e) => {
                  if (
                    get(state, 'table.mobile.checkbox') &&
                    state.db.definition
                  ) {
                    if (!checked[pk]) {
                      checked[pk] = row
                    } else {
                      delete checked[pk]
                    }

                    const onChecked = get(state, 'table.mobile.onChecked')
                    if (onChecked) {
                      onChecked(checked)
                    }
                    render()
                  }

                  if (state.table.onRowClick)
                    state.table.onRowClick(row, idx, e, state)
                }}
                onSwipeoutDeleted={onSwipeoutDeleted}
                swipeout={!!swipeout}
                {...(Array.isArray(columns) ? content : {})}
                ref={
                  ((ref: any) => {
                    if (ref && ref.el && typeof columns === 'function') {
                      if (row.__listMeta) {
                        waitUntil(() =>
                          ref.el.querySelector('.item-inner')
                        ).then(() => {
                          if (
                            row.__listMeta.f7el !==
                            ref.el.querySelector('.item-inner')
                          ) {
                            row.__listMeta.f7el =
                              ref.el.querySelector('.item-inner')

                            row.__listMeta.f7row = createPortal(
                              content,
                              row.__listMeta.f7el
                            )
                            render()
                          }
                        })
                      }
                    }
                  }) as any
                }
              >
                {typeof columns === 'function' && (
                  <div
                    onClick={(ev) => {
                      ev.stopPropagation()
                      ev.preventDefault()
                      if (state.table.onRowClick)
                        state.table.onRowClick(row, idx, ev, state)
                    }}
                  >
                    {row.__listMeta.f7row}
                  </div>
                )}
                {swipeout}
              </ListItem>
            )
          })}
        </List>
      )}
    </div>
  )
}
