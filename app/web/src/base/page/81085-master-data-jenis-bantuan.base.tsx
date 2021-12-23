base(
  {
    meta: () => {
      const meta = {};
      return meta;
    },
    init: ({ meta }) => {},
  },
  ({ meta }) => (
    <>
      <>
        {" "}
        <admin
          nav={["bantuan"]}
          content={{
            "Jenis Bantuan": {
              table: "m_jenis_bantuan",
              label: "Jenis bantuan",
              list: {
                action: {
                  create: "Tambah",
                },
                table: {
                  columns: [
                    [
                      "jenis_bantuan",
                      {
                        title: "Jenis bantuan",
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
                  jenis_bantuan: {
                    title: "Jenis bantuan",
                    type: "text",
                    required: true,
                  },
                },
                layout: ["jenis_bantuan"],
              },
            },
          }}
        />
      </>
    </>
  )
);
