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
          nav={["kegiatan"]}
          content={{
            "Kegiatan CSR": {
              table: "m_kegiatan",
              list: {
                action: {
                  create: "Tambah",
                },
                table: {
                  columns: [
                    [
                      "m_pillar.name",
                      {
                        width: 150,
                        title: "Pilar",
                      },
                    ],
                    [
                      "nama_kegiatan",
                      {
                        title: "Kegiatan CSR",
                        width: 350,
                      },
                    ],
                  ],
                },
                params: {
                  include: {
                    m_pillar: true,
                  },
                },
              },
              form: {
                params: {
                  include: {
                    m_pillar: true,
                  },
                },
                action: () => ({
                  save: "Simpan",
                  jsonEdit: false,
                }),
                alter: {
                  nama_kegiatan: {
                    title: "Kegiatan CSR",
                    type: "text",
                    required: true,
                  },
                },
                layout: ["m_pillar", "nama_kegiatan"],
              },
            },
          }}
        />
      </>
    </>
  )
);
