/** @jsx jsx */
import { jsx } from '@emotion/react'
import { PrimaryButton } from '@fluentui/react'
import { useRef } from 'react'
import { useRender } from '../../../platform/node_modules/web-utils/src/useRender'
import { isEditor } from '../user'
import { ArticleEditor } from './article-editor'

export const Main = () => {
  const _ = useRef({
    article: {
      mode: 'edit' as 'read' | 'edit',
      data: {},
    },
  })
  const meta = _.current

  const render = useRender()

  return (
    <div className="flex flex-1 w-full h-full max-w-8xl mx-auto">
      <div className="lg:flex flex-1">
        <div
          id="sidebar"
          className="fixed z-40 inset-0 flex-none h-full bg-black bg-opacity-25 w-full lg:bg-white lg:static lg:h-auto lg:overflow-y-visible lg:pt-0 lg:w-60 xl:w-72 lg:block hidden"
        >
          <div
            id="nav-wrapper"
            className="h-full overflow-y-auto scrolling-touch lg:h-auto lg:block lg:bg-transparent overflow-hidden lg:top-18 bg-white mr-24 lg:mr-0"
          >
            <nav
              id="nav"
              className="px-1 pt-6 overflow-y-auto font-medium text-base sm:px-3 xl:px-5 lg:text-sm pb-10 lg:pt-10 lg:pb-14 sticky?lg:h-(screen-18)"
            >
              {isEditor() && meta.article.mode === 'read' && (
                <PrimaryButton
                  iconProps={{ iconName: 'Add' }}
                  onClick={() => {
                    meta.article.mode = 'edit'
                    meta.article.data = {}
                    render()
                  }}
                >
                  Tambah Artikel
                </PrimaryButton>
              )}
            </nav>
          </div>
        </div>
        <div
          id="content"
          className="min-w-0 w-full flex flex-auto lg:static lg:max-h-full lg:overflow-visible"
        >
          {meta.article.mode === 'edit' && (
            <ArticleEditor data={meta.article.data} />
          )}
        </div>
      </div>
    </div>
  )
}
