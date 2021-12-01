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
          nav={["instansi_penerima"]}
          content={{
            "Instansi Penerima": {
              table: "m_instansi_penerima",
              label: "Instansi Penerima",
              list: {
                action: {
                  create: "Tambah"
                },
                table: {
                  columns: [
                    [
                      "instansi_penerima",
                      {
                        title: "Instansi Penerima",
                      },
                    ],
                  ],
                },
              },
              form: {
                action: () => ({
                  save: "Simpan",
                  jsonEdit: false,
                }),
                alter: {
                  instansi_penerima: {
                    title: "Instansi Penerima",
                    type: "text",
                    required: true,
                  },
                },
                layout: ["instansi_penerima"],
              },
            },
          }}
        />
      </>
    </>
  )
);
