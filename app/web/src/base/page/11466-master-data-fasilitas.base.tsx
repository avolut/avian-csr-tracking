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
          nav={["fasilitas"]}
          content={{
            "Fasilitas Penerima Bantuan Lainnya": {
              table: "m_fasilitas_lainnya",
              list: {
                action: {
                  create: "Tambah",
                },
                table: {
                  columns: [
                    [
                      "fasilitas",
                      {
                        title: "Jenis Fasilitas",
                        width: 350,
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
                  fasilitas: {
                    title: "Fasilitas Lainnya",
                    type: "text",
                    required: true,
                  },
                },
                layout: ["fasilitas"],
              },
            },
          }}
        />
      </>
    </>
  )
);
