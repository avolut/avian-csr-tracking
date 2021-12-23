/** @jsx jsx */
import { jsx, css } from '@emotion/react'

interface IProps {
  children: any
  onClick?: (e) => void
  onBlur?: (e) => void
  className?: string
  style?: string
  disabled?: boolean
}

export default ({
  children,
  onClick,
  onBlur,
  className,
  style,
  disabled,
}: IProps) => {
  return (
    <button
      className={`flex self-stretch items-center justify-center px-4 py-2 bg-green-600 rounded ${className}`}
      css={css`
        ${style}
      `}
      onClick={onClick}
      onBlur={onBlur}
      disabled={disabled}
    >
      <div className={`text-base leading-normal text-center text-white`}>
        {children ?? 'Button'}
      </div>
    </button>
  )
}
