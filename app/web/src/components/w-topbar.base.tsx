base(
  {
    meta: {},
    init: ({ meta, params, children }) => {},
  },
  ({ meta, children }) => (
    <>
      <div class="flex self-stretch items-center justify-start pl-5 border-indigo-50">
        <div
          class="flex flex-1 self-stretch items-center justify-between"
          style={css`
            height: 50px;
          `}
        >
          <div class="text-xl font-bold leading-none text-gray-600">
            {title}
          </div>
        </div>
      </div>
    </>
  )
);
