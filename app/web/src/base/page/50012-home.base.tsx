base(
  {
    meta: {},
    init: async ({ meta }) => {},
  },
  ({ meta }) => (
    <>
      <>
        <div class="flex flex-1 self-stretch items-start justify-start">
          <div class="flex flex-1 self-stretch flex-col items-start justify-start bg-white">
            <div class={`flex self-stretch flex-col items-start justify-start`}>
              <w-topbar
                class={`flex flex-1 self-stretch items-center justify-start px-5 bg-green-50 border border-indigo-50`}
              />
            </div>
          </div>
        </div>
      </>
    </>
  )
);
