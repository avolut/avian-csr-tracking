/** @jsx jsx */
import { jsx, css } from '@emotion/react'
import { Dropdown, Label } from '@fluentui/react'
import set from 'lodash.set'
import { useContext, useRef } from 'react'
import { IFilterItemText, IFilterProp } from '../../../../ext/types/__filter'
import { IBaseFilterDef } from '../../../../ext/types/__list'
import { getFilterDef } from './FilterSingle'

export const queryFilterSelect: IBaseFilterDef['modifyQuery'] = (props) => {
  const { params, instance, name } = props

  set(params.where, name, {
    equals: instance.value,
    mode: 'insensitive',
  })
}

export const FilterSelect = ({
  ctx,
  name,
  children,
  onSubmit,
}: IFilterProp<IFilterItemText>) => {
  const state = useContext(ctx)
  const filter = state.filter.instances[name]
  const def = getFilterDef(name, state)
  const _ = useRef({
    originalValue: filter.value,
  })
  const meta = _.current
  const render = state.filter.instances[name].render
  const submit = () => {
    onSubmit()
    render()
    if (meta.originalValue !== filter.value) {
      state.db.query()
    }
  }
  return children({
    name,
    submit,
    FilterInput: (props) => {
      return (
        <Dropdown
          defaultValue={filter.value}
          css={css`
            min-width: 80px;
            .ms-TextField > span {
              display: none;
            }
          `}
          selectedKey={filter.value ? filter.value : undefined}
          options={filter.options}
          onChange={(_, opt) => {
            filter.value = (opt as any).key
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              submit()
            }
          }}
        />
      )
    },
    def,
    filter,
    operators: [{ label: 'Select', value: 'equals' }],
    ValueLabel: () => {
      return <Label className="filter-label">{filter.value} </Label>
    },
  })
}