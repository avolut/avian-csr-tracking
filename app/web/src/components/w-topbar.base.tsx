base(
  {
    meta: {},
    init: ({ meta, params, children }) => {},
  },
  ({ meta }) => (
    <div class="flex self-stretch items-center justify-start pl-5 border-indigo-50">
      <div
        class="flex flex-1 self-stretch items-center justify-between"
        style={css`
          height: 50px;
        `}
      >
        <div className="text-xl font-bold leading-none text-gray-600">
          {title}
        </div>
        {open ?
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
             stroke-linecap="round"
             stroke-linejoin="round"
             stroke-width="2"
             d="M6 18L18 6M6 6l12 12"
           />
         </svg>
        </div>
       :
        <div className="lg:hidden flex flex-col px-3 cursor-pointer" onClick={onClickOpen}>
          <div className="w-5 h-1 bg-gray-500 mb-1"></div>
          <div className="w-5 h-1 bg-gray-500 mb-1"></div>
          <div className="w-5 h-1 bg-gray-500 mb-1"></div>
        </div>
        }
      </div>
     
    </div>
  )
)
