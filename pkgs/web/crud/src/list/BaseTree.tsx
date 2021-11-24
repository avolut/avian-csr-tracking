/** @jsx jsx */
import { css, jsx } from '@emotion/react'
import { useRef, useEffect, Fragment } from 'react'
import { BaseWindow } from 'web-init/src/window'
import { useRender } from 'web-utils/src/useRender'

import { ListItem, Page, PageContent, List } from 'framework7-react'

interface IBaseTree {
  table: string
  idCol: string
  parentCol: string
  checked?: any[]
  row?: (args: {
    row: any
    checked: boolean
    expand: () => Promise<void>
    collapse: () => Promise<void>
  }) => any
  onChecked?: (checked: any[]) => void
  wrap?: (args: { children: any; depth: number }) => any
  checkbox?: boolean
}

interface IBaseTreeItem {
  row: any
  checked: boolean
  collapsed: boolean
  children?: IBaseTreeItem[]
  parent?: IBaseTreeItem
}

declare const window: BaseWindow

export const BaseTree = (props: IBaseTree) => {
  const _ = useRef({
    tree: [] as IBaseTreeItem[],
    init: false,
    loading: false,
  })
  const meta = _.current
  const render = useRender()
  const query = async (parent?: IBaseTreeItem) => {
    const list = await window.db[props.table].findMany({
      where: {
        [props.parentCol]: parent ? parent.row[props.idCol] : null,
      },
    })
    const final = list.map((e) => {
      return {
        row: e,
        parent,
      }
    })
    return final
  }

  const checked = (props.checked || []).map((e) => {
    if (typeof e === 'object') {
      return e[props.idCol]
    }
    return e
  }) as any[]

  useEffect(() => {
    query().then(async (list) => {
      meta.tree = list
      render()

      const recursive = async (items: IBaseTreeItem[]) => {
        for (let c of items) {
          if (checked.indexOf(c.row[props.idCol]) >= 0) {
            c.checked = true
            render()
            if (c.children === undefined) {
              c.children = await query(c)
            }
            if (c.children) await recursive(c.children)
          }
        }
      }
      await recursive(meta.tree)
    })
  }, [props.table])

  const wrap =
    props.wrap ||
    (({ children, depth }) => (
      <div
        css={css`
          margin-left: ${depth * 20}px;
        `}
      >
        <List>{children}</List>
      </div>
    ))

  const row =
    props.row ||
    (({ row, checked, expand, collapse }) => {
      return (
        <ListItem
          title={row.name}
          checked={!!props.checkbox ? !!checked : undefined}
          checkbox={!!props.checkbox}
          onChange={async (e) => {
            if (e.target.checked) {
              await expand()
            } else {
              await collapse()
            }

            if (props.onChecked) {
              const result: any[] = []
              const recursive = (items: IBaseTreeItem[]) => {
                for (let item of items) {
                  if (item.checked) {
                    result.push(item.row)
                  }
                  if (item.children) {
                    recursive(item.children)
                  }
                }
              }
              recursive(meta.tree)
              props.onChecked(result)
            }
          }}
        />
      )
    })

  return (
    <div
      css={css`
        .list {
          li {
            list-style: none;
          }
          display: flex;
          flex-direction: column;
        }
      `}
    >
      <SingleLevelTree
        tree={meta.tree}
        row={row}
        wrap={wrap}
        checkbox={!!props.checkbox}
        idCol={props.idCol}
        parentCol={props.parentCol}
        query={query}
        depth={0}
      />
    </div>
  )
}

const SingleLevelTree = ({
  tree,
  wrap,
  row,
  parentCol,
  idCol,
  query,
  depth,
  checkbox,
}: {
  depth: number
  tree: IBaseTreeItem[]
  checkbox: Exclude<IBaseTree['checkbox'], undefined>
  wrap: Exclude<IBaseTree['wrap'], undefined>
  row: Exclude<IBaseTree['row'], undefined>
  idCol: IBaseTree['idCol']
  parentCol: IBaseTree['parentCol']
  query: (parent?: IBaseTreeItem) => Promise<IBaseTreeItem[]>
}) => {
  const render = useRender()
  return wrap({
    depth,
    children: (
      <>
        {tree.map((e, idx) => {
          return (
            <Fragment key={idx}>
              {row({
                row: e.row,
                checked: e.checked,
                collapse: async () => {
                  e.collapsed = true
                  render()

                  if (checkbox) {
                    e.checked = false
                    render()

                    const recursive = async (items: IBaseTreeItem[]) => {
                      for (let item of items) {
                        item.checked = false
                        item.collapsed = true

                        render()
                        if (item.children === undefined) {
                          item.children = await query(item)
                        }

                        await recursive(item.children)
                      }
                    }
                    if (e.children) {
                      await recursive(e.children)
                    }
                  }
                },
                expand: async () => {
                  e.collapsed = false
                  render()

                  if (e.children === undefined) {
                    e.children = await query(e)
                    render()
                  }

                  if (checkbox) {
                    e.checked = true
                    render()
                    const recursive = async (items: IBaseTreeItem[]) => {
                      for (let item of items) {
                        item.checked = true
                        item.collapsed = false

                        render()
                        if (item.children === undefined) {
                          item.children = await query(item)
                        }

                        await recursive(item.children)
                      }
                    }
                    await recursive(e.children)
                  }
                },
              })}
              {!e.collapsed && e.children && e.children.length > 0 && (
                <SingleLevelTree
                  depth={depth + 1}
                  tree={e.children}
                  row={row}
                  wrap={wrap}
                  checkbox={checkbox}
                  idCol={idCol}
                  parentCol={parentCol}
                  query={query}
                />
              )}
            </Fragment>
          )
        })}
      </>
    ),
  })
}
