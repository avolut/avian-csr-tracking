/** @jsx jsx */
import { css, jsx } from '@emotion/react'
import { BaseWindow } from 'web-init/src/window'
import { Label } from '@fluentui/react'
import { useRef, useEffect, memo } from 'react'
import { useRender } from 'web-utils/src/useRender'

type IMenuSingle = {
  idx: number
  title: string
  url?: string
  opened?: boolean
  active?: boolean
  render?: () => void
  siblings: IMenuSingle[]
  children: IMenuSingle[]
  parent: IMenuSingle
}

declare const window: BaseWindow

type IMenuMeta = {
  active: number[]
  renderTimeout: ReturnType<typeof setTimeout>
}

export const Menu = memo(
  ({ data, className }: { data: IMenuSingle[]; className?: string }) => {
    if (!(window as any).menuView) {
      ;(window as any).menuView = {
        active: [],
        renderTimeout: 0 as any,
      }
    }
    const menus = toJS(data)
    const meta = (window as any).menuView
    const _render = useRender()
    const render = () => {
      if (meta.renderTimeout) {
        clearTimeout(meta.renderTimeout)
      }
      meta.renderTimeout = setTimeout(() => {
        _render()
      }, 1000)
    }

    const walk = (menus: IMenuSingle[], parent?: IMenuSingle) => {
      for (let menu of menus) {
        menu.active = false
        menu.opened = false
        if (parent) menu.parent = parent
        if (menu.url === location.pathname) {
          menu.active = true
          let cur = menu
          while (cur.parent) {
            cur = cur.parent
            cur.active = true
            cur.opened = true
          }
        }
        if (menu.children) {
          walk(menu.children, menu)
        }
      }
    }
    walk(menus)

    return (
      <div
        className={`${
          className || ''
        } relative self-stretch flex flex-1 overflow-auto`}
      >
        <div className="absolute inset-0 menu-container">
          <MenuTree menus={menus} meta={meta} level={0} render={render} />
        </div>
      </div>
    )
  }
)

export const MenuTree = ({
  menus,
  meta,
  parent,
  level,
  render,
}: {
  level: number
  menus: IMenuSingle[]
  meta: IMenuMeta
  parent?: IMenuSingle
  render: () => void
}) => {
  return (
    <div className={`menu-tree flex flex-col items-stretch`}>
      {menus.map((e, idx) => {
        e.idx = idx
        if (parent) e.parent = parent
        e.siblings = menus
        return (
          <MenuSingle
            key={idx}
            menu={e}
            render={render}
            meta={meta}
            level={level}
          />
        )
      })}
    </div>
  )
}

export const MobileText = (props) => {
  return <div {...props} />
}

export const MenuSingle = ({
  menu,
  meta,
  render,
  level,
}: {
  level: number
  menu: IMenuSingle
  meta: IMenuMeta
  render: () => void
}) => {
  const Text = window.platform === 'web' ? Label : MobileText
  const _render = useRender()
  menu.render = _render
  return (
    <div
      className={`menu-item flex flex-col cursor-pointer ${
        menu.active ? 'active' : ''
      } ${!menu.opened ? 'collapsed' : ''}`}
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        if (menu.children) {
          menu.opened = !menu.opened
          menu.active = !!menu.opened
          let cur = menu
          for (let i of cur.siblings) {
            if (i !== menu) i.opened = false
            menu.render()
          }
        } else if (menu.url) {
          window.navigate(menu.url)
        }
      }}
    >
      <Text
        className="menu-title cursor-pointer"
        css={css`
          margin: 0px;
          padding: 0px;
        `}
      >
        {menu.title}
      </Text>
      <div className={`${menu.opened ? 'flex' : 'hidden'} flex-col`}>
        {menu.children && (
          <MenuTree
            menus={menu.children}
            meta={meta}
            parent={menu}
            render={render}
            level={level + 1}
          />
        )}
      </div>
    </div>
  )
}

export default Menu
