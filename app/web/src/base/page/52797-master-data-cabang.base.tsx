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
              list: {
                action: {
                  create: "Tambah",
                },
                table: {
                  columns: [
                    [
                      "m_area_tirta.nama_area_tirta",
                      {
                        title: "Area Tirta",
                        width: 100,
                      },
                    ],
                    [
                      "nama_cabang",
                      {
                        title: "Cabang",
                        width: 350,
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
