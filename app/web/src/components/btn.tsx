/** @jsx jsx */
import { jsx } from '@emotion/react'
import { useComponent } from 'web.utils/component'

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
  const _component = useComponent('btn', '/app/web/src/components/btn', {
    children,
    onClick,
    onBlur,
    className,
    style,
    disabled,
  })
  return eval(_component.render)
}
