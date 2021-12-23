/** @jsx jsx */
import { jsx, css } from '@emotion/react'
import { TextField } from '@fluentui/react'
import { observer } from 'mobx-react-lite'

interface IProps {
  value: string
  onChange: (e) => void
  type?: string
  defaultValue?: string
  styles?: Object
  isRequired?: Boolean
  className?: string
  style?: string
  errors?: any[]
  rows?: number
  placeholder?: string
}

export default observer((props: IProps) => {
  return (
    <div
      className={`flex self-stretch flex-col space-y-2.5 items-start justify-start w-full ${props.className}`}
      css={css`
        ${props.style}
      `}
    >
      <TextField
        className={`flex self-stretch flex-col items-start justify-center bg-gray-100 w-full ${props.className}`}
        css={css`
          ${props.style}
        `}
        placeholder={props.placeholder}
        value={props.value}
        onChange={props.onChange}
        borderless={true}
        type={props.type}
        defaultValue={props.defaultValue}
        rows={props.rows}
        styles={Object.assign(
          {
            wrapper: {
              width: '100%',
            },
          },
          props.styles
        )}
      />
    </div>
  )
})
