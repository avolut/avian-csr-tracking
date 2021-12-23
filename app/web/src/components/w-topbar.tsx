/** @jsx jsx */
import { jsx, css } from '@emotion/react'
import { observer } from 'mobx-react-lite'

export default observer(({ title, open, onClickOpen }: any) => {
  const date = new Date()

  return (
    <div className="flex self-stretch items-center justify-start pl-5 border-indigo-50">
      <div
        className="flex flex-1 self-stretch items-center justify-between"
        css={css`
          height: 50px;
        `}
      >
        <div className="text-xl font-bold leading-none text-gray-600">
          {title}
        </div>
        {open ? (
          <div className="px-3 cursor-pointer" onClick={onClickOpen}>
            <svg
              className="h-6 w-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
        ) : (
          <div
            className="lg:hidden flex flex-col px-3 cursor-pointer"
            onClick={onClickOpen}
          >
            <div className="w-5 h-1 bg-gray-500 mb-1"></div>
            <div className="w-5 h-1 bg-gray-500 mb-1"></div>
            <div className="w-5 h-1 bg-gray-500 mb-1"></div>
          </div>
        )}
      </div>
    </div>
  )
})
