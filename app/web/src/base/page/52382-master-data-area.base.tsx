base(
  {
    meta: {},
    init: ({ meta }) => { },
  },
  ({ meta }) => (
    <>
      <>
        {" "}
        <admin
          nav={["area"]}
          content={{
            "Area Tirta": {
              table: "m_area_tirta",
              label: "Area Tirta",
              list: {
                action: {
                  create: "Tambah"
                },
                table: {
                  columns: [
                    [
                      "nama_area_tirta",
                      {
                        title: "Nama Area Tirta",
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
                  nama_area_tirta: {
                    title: "Nama Area Tirta",
                    type: "text",
                    required: true,
                  },
                },
                layout: ["nama_area_tirta"],
              },
            },
          }}
        />
      </>
    </>
  )
);
