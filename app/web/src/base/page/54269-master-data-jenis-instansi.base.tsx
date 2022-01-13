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
          nav={["instansi"]}
          content={{
            "Jenis Instansi": {
              table: "m_jenis_instansi",
              list: {
                action: {
                  create: "Tambah",
                },
                table: {
                  columns: [
                    [
                      "m_instansi_penerima.instansi_penerima",
                      {
                        title: "Instansi Penerima",
                        width: 200,
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
