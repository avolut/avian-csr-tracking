base(
  {
    meta: {},
    init: ({ meta }) => { },
  },
  ({ meta }) => (
    <div className="flex flex-1">
      <pure-tab
        tabs={[{
          title: "Pilar CSR", component: <iframe
            src="http://165.22.251.237:3000/public/dashboard/f2f0ae4a-12be-410d-8464-4b223c2ffdee"
            frameBorder="0"
            className="w-full"
            css={css`width: 100%; height: 100%;`}
          ></iframe>
        }, {
          title: "Produk", component: <iframe
            src="http://165.22.251.237:3000/public/dashboard/f2f0ae4a-12be-410d-8464-4b223c2ffdee"
            frameBorder="0"
            className="w-full"
            css={css`width: 100%; height: 100%;`}
          ></iframe>
        }, {
          title: "Penerima", component: <iframe
            src="http://165.22.251.237:3000/public/dashboard/f2f0ae4a-12be-410d-8464-4b223c2ffdee"
            frameBorder="0"
            className="w-full"
            css={css`width: 100%; height: 100%;`}
          ></iframe>
        }]
          .map((e, idx) => {
            return {
              title: e.title,
              component: () => {
                return <div key={idx}>{e.component}</div>
              },
            }
          })
          .filter((e) => !!e.title)}
        position={"top"}
      />
    </div>
  )
);
