/** @jsx jsx */
import { jsx } from '@emotion/react'
import BaseForm from '../../../web/crud/src/form/BaseForm'

export const ArticleEditor = ({ data: any }) => {
  return (
    <div className="flex flex-1 self-stretch">
      <BaseForm
        data={{ title: 'haloha', content: 'halohi' }}
        layout={['title', 'content']}
      />
    </div>
  )
}
