base(
  {
    meta: {},
    init: ({ meta }) => {},
  },
  ({ meta }) => (
    <>
      <>
        {" "}
        <admin
          nav={["supplier"]}
          content={{
            supplier: {
              table: "m_supplier",
              label: "Supplier",
              list: {
                table: {
                  columns: [
                    [
                      "nama_supplier",
                      {
                        title: "Nama Supplier",
                      },
                    ],
                  ],
                },
              },
              form: {
                create: {
                  title: "Tambah",
                },
                action: {
                  jsonEdit: false,
                },
                alter: {
                  nama_supplier: {
                    title: "Nama Supplier",
                    type: "text",
                    required: true,
                  },
                },
                layout: ["nama_supplier"],
              },
            },
          }}
        />
      </>
    </>
  )
);
