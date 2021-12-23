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
          nav={["cabang"]}
          content={{
            cabang: {
              table: "m_cabang",
              label: "Cabang",
              list: {
                action: {
                  create: "Tambah",
                },
                table: {
                  columns: [
                    [
                      "_",
                      {
                        title: "Area Tirta",
                        value: (item) => {
                          return (
                            <span>{item.m_area_tirta.nama_area_tirta}</span>
                          );
                        },
                      },
                    ],
                    [
                      "nama_cabang",
                      {
                        title: "Cabang",
                      },
                    ],
                  ],
                },
                params: {
                  include: {
                    m_area_tirta: true,
                  },
                },
              },
              form: {
                params: {
                  include: {
                    m_area_tirta: true,
                  },
                },
                action: () => ({
                  save: "Simpan",
                  jsonEdit: false,
                }),
                alter: {
                  nama_cabang: {
                    title: "Cabang",
                    type: "text",
                    required: true,
                  },
                },
                layout: ["m_area_tirta", "nama_cabang"],
              },
            },
          }}
        />
      </>
    </>
  )
);
