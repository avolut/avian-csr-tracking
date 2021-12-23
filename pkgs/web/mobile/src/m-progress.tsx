/** @jsx jsx */
import { jsx } from '@emotion/react'
import { Progressbar } from 'framework7-react'

export default (rawprops: Parameters<typeof Progressbar>[0]) => {
  return <Progressbar {...rawprops} />
}
