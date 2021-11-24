/** @jsx jsx */
import { jsx } from '@emotion/react'
import { waitUntil } from 'libs'
import get from 'lodash.get'
import { Context, useContext } from 'react'
import { BaseWindow } from 'web-init/src/window'
import { IAdminSingle } from '../../ext/types/admin'
import { ICRUDContext } from '../../ext/types/__crud'
import { weakUpdate } from './form/BaseForm'
import { BaseList } from './list/BaseList'

declare const window: BaseWindow

export const CRUDBodyList = ({
  content,
  ctx,
}: {
  content: IAdminSingle
  ctx: Context<ICRUDContext>
}) => {
  const action = weakUpdate(
    {
      create: true,
      other: {
        import: true,
        export: true,
      },
    },
    get(content, 'list.action', {})
  )
  if (get(content, 'list.table.create') !== undefined) {
    action.create = get(content, 'list.table.create')
  }
  const state = useContext(ctx)

  let mobile = {
    ...{ mode: 'list' as any, swipeout: true },
    ...(get(content, 'list.table') || {}),
  }
  if (get(content, 'list.table.swipeout') !== undefined) {
    mobile.swipeout = get(content, 'list.table.swipeout')
  }

  return (
    <BaseList
      id={`list`}
      table={content.table}
      mobile={mobile}
      parentCtx={ctx as any}
      query={get(content, 'list.query')}
      header={get(content, 'list.header')}
      title={get(content, 'list.title')}
      params={get(content, 'list.params', {})}
      onScroll={(e) => {
        state.crud.listScroll = {
          x: e.scrollLeft,
          y: e.scrollTop,
        }
      }}
      scroll={state.crud.listScroll}
      onLoad={get(content, 'list.onLoad') || get(content, 'list.table.onLoad')}
      onInit={get(content, 'list.onInit')}
      filter={get(content, 'list.filter')}
      lateQuery={get(content, 'list.lateQuery')}
      columns={get(content, 'list.table.columns')}
      editable={get(content, 'list.editable')}
      checkbox={get(content, 'list.checkbox')}
      wrapList={get(content, 'list.wrapper')}
      wrapRow={get(content, 'list.table.wrapRow')}
      action={action}
      onRowClick={async (row, idx, ev, state) => {
        const parent = state.tree.parent as ICRUDContext
        const onRowClick = get(content, 'list.table.onRowClick')

        if (state.db.partialLoading) {
          state.db.loading = true
          state.table.render()

          waitUntil(() => !state.db.partialLoading)

          return
        }

        if (onRowClick) {
          if (!(await onRowClick(row, idx, ev, state))) {
            state.table.isRowClickable = false
            state.component.render()
            return
          }
        }

        const onEdit = get(content, 'form.edit.onClick')
        if (onEdit) {
          await onEdit(row)
        }

        if (
          window.platform === 'web' &&
          !parent.tree.parent &&
          state.db.definition &&
          row[state.db.definition.pk]
        ) {
          window.preventPopChange = true
          location.hash = row[state.db.definition.pk]
        }
        parent.crud.setMode('form', row)
      }}
    />
  )
}
