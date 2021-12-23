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
              label: "Kegiatan CSR",
              list: {
                action: {
                  create: "Tambah",
                },
                table: {
                  columns: [
                    [
                      "_",
                      {
                        width: 200,
                        title: "Pilar",
                        value: (item) => {
                          return <span>{item.m_pillar.name}</span>;
                        },
                      },
                    ],
                    [
                      "nama_kegiatan",
                      {
                        title: "Kegiatan CSR",
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
