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
          nav={["kegiatan"]}
          content={{
            "Kegiatan CSR": {
              table: "m_kegiatan",
              label: "Kegiatan CSR",
              list: {
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
                create: {
                  title: "Tambah",
                },
                action: {
                  jsonEdit: false,
                },
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
