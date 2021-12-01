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
          nav={["instansi"]}
          content={{
            "Jenis Instansi": {
              table: "m_jenis_instansi",
              label: "Jenis instansi",
              list: {
                action: {
                  create: "Tambah"
                },
                table: {
                  columns: [
                    [
                      "_",
                      {
                        title: "Instansi Penerima",
                        width: 200,
                        value: (item) => {
                          return (
                            <span>
                              {item.m_instansi_penerima.instansi_penerima}
                            </span>
                          );
                        },
                      },
                    ],
                    [
                      "jenis_instansi",
                      {
                        title: "Jenis instansi",
                        width: 200,
                      },
                    ],
                  ],
                },
                params: {
                  include: {
                    m_instansi_penerima: true,
                  },
                },
              },
              form: {
                params: {
                  include: {
                    m_instansi_penerima: true,
                  },
                },
                action: () => ({
                  save: "Simpan",
                  jsonEdit: false,
                }),
                alter: {
                  jenis_instansi: {
                    title: "Jenis instansi",
                    type: "text",
                    required: true,
                  },
                },
                layout: ["m_instansi_penerima", "jenis_instansi"],
              },
            },
          }}
        />
      </>
    </>
  )
);
