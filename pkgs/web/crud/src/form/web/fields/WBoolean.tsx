/** @jsx jsx */
import { jsx, css } from '@emotion/react'
import { Toggle } from '@fluentui/react'
import set from 'lodash.set'
import { useContext } from 'react'
import { BaseWindow } from 'web-init/src/window'
import { IBaseFieldProps } from '../../../../../ext/types/__form'
declare const window: BaseWindow
export const WBoolean = ({ name, internalChange, ctx }: IBaseFieldProps) => {
  const form = useContext(ctx)
  const field = form.config.fields[name]

  if (!field) return null
  const state = field.state

  return (
    <Toggle
      css={css`
        margin: 0px;
        padding: 0px 0px;
        height: 34px;

        align-items: center;
        display: flex;
        border-radius: 2px;
      `}
      defaultChecked={!!state.value}
      onText="Yes"
      offText="No"
      
      onChange={(_, value) => {
        set(form.db.data, name, value)
        if (typeof state.onChange === 'function')
          state.onChange(value, {
            state: form,
            row: form.db.data,
            col: name,
          })
        internalChange(value)
        state.render()
      }}
    />
  )
}
