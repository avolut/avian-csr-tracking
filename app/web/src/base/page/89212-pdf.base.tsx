base(
  {
    meta: () => {
      const meta = {};
      return meta;
    },
    init: ({ meta }) => {},
  },
  ({ meta }) => <pdf-reader csrId={Number(params.csrId)} />
);
