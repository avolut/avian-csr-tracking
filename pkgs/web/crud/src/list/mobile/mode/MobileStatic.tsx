/** @jsx jsx */
import { jsx } from '@emotion/react'
import {
  List,
  ListItem,
  SwipeoutActions,
  SwipeoutButton,
} from 'framework7-react'
import { db, waitUntil } from 'libs'
import { createPortal } from 'react-dom'
import { BaseWindow } from 'web-init/src/window'
import { IBaseListContext } from '../../../../../ext/types/__list'
import { columnized } from '../BaseListMobile'

declare const window: BaseWindow
export const MobileStatic = ({
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
  return (
    <ul className="base-list-static ">
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
          if (row.__listMeta && row.__listMeta.f7el && !row.__listMeta.f7row) {
            row.__listMeta.f7row = createPortal(content, row.__listMeta.f7el)
          }
        }

        return (
          <ListItem
            link={true}
            noChevron={true}
            key={idx}
            onClick={(ev) => {
              if (state.table.onRowClick)
                state.table.onRowClick(row, idx, ev, state)
            }}
            onSwipeoutDeleted={async () => {
              state.db.loading = true
              render()
              await db[state.db.tableName].delete({
                where: {
                  [state.db.definition.pk]: row[state.db.definition.pk],
                },
              })

              state.db.loading = false
              render()
            }}
            swipeout={!!swipeout}
            {...(Array.isArray(columns) ? content : {})}
            ref={
              ((ref: any) => {
                if (ref && ref.el && typeof columns === 'function') {
                  if (row.__listMeta) {
                    waitUntil(() => ref.el.querySelector('.item-inner')).then(
                      () => {
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
                      }
                    )
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
    </ul>
  )
}
