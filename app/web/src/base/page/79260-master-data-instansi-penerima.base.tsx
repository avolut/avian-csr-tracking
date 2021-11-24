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
                create: {
                  title: "Tambah",
                },
                action: {
                  jsonEdit: false,
                },
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
