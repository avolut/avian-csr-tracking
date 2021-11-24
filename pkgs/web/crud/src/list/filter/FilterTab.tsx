/** @jsx jsx */
import { css, jsx } from '@emotion/react'
import { waitUntil } from 'libs'
import set from 'lodash.set'
import { useContext, useEffect, useRef } from 'react'
import { useRender } from 'web-utils/src/useRender'
import {
  IFilterItemTab,
  IFilterItemText,
  IFilterProp,
} from '../../../../ext/types/__filter'
import { IBaseFilterDef } from '../../../../ext/types/__list'
import { PureTab } from '../../form/web/WFormTab'
import { getFilterDef } from './FilterSingle'

export const queryFilterTab: IBaseFilterDef['modifyQuery'] = (props) => {
  const { params, instance, name } = props
  set(params.where, name, instance.value)
}

export const FilterTab = ({
  ctx,
  name,
  children,
  onSubmit,
}: IFilterProp<IFilterItemText>) => {
  const state = useContext(ctx)
  const filter = state.filter.instances[name] as IFilterItemTab
  const def = getFilterDef(name, state)
  const _ = useRef({
    originalValue: filter.value,
  })
  const meta = _.current

  const render = useRender()
  const renderParent = state.filter.instances[name].render
  const submit = async () => {
    onSubmit()
    renderParent()
    await state.db.query()
  }

  useEffect(() => {
    if (typeof filter.items === 'undefined') {
      waitUntil(() => !state.db.loading && !state.db.partialLoading).then(
        () => {
          const uniqueTabs = {}
          for (let row of state.db.list) {
            if (typeof row[name] !== 'object') {
              uniqueTabs[row[name].toLowerCase().trim()] = row[name]
            }
          }
          filter.items = Object.values(uniqueTabs)
          render()
        }
      )
    }
  }, [])

  if (!filter.items) return null

  return children({
    name,
    submit,
    FilterInput: (props) => {
      return (
        <div
          css={css`
            margin-bottom: -13px;
            .pure-tab {
              border-bottom: 0px !important;

              .top .tab-item {
                border-top-left-radius: 2px !important;
                border-top-right-radius: 2px !important;
                padding: 6px 10px 14px 10px !important;
              }
            }
          `}
        >
          <PureTab
            active={filter.value || ''}
            position={filter.position || 'top'}
            onChange={async (tab) => {
              if (filter.value === tab) {
                filter.value = ''
              } else {
                filter.value = tab
              }
              submit()
            }}
            tabs={filter.items.map((e) => {
              return {
                title: typeof e === 'string' ? e : e.label,
                component: null,
              }
            })}
          />
        </div>
      )
    },
    def,
    filter,
    operators: [],
    ValueLabel: () => {
      return <></>
    },
  })
}
