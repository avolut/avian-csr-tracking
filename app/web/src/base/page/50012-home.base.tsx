base(
  {
    meta: () => {
      const meta = {};
      return meta;
    },
    init: async ({ meta }) => {},
  },
  ({ meta }) => (
    <>
      <>
        <div className="flex flex-1 self-stretch items-start justify-start">
          <div className="flex flex-1 self-stretch flex-col items-start justify-start bg-white">
            <div className={`flex self-stretch flex-col items-start justify-start`}>
              {/* <w-topbar
             className={`flex flex-1 self-stretch items-center justify-start px-5 bg-green-50 border border-indigo-50`}
            /> */}
            </div>
          </div>
        </div>
      </>
    </>
  )
);
