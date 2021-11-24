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
          nav={["bantuan"]}
          content={{
            "Jenis Bantuan": {
              table: "m_jenis_bantuan",
              label: "Jenis bantuan",
              list: {
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
                create: {
                  title: "Tambah",
                },
                action: {
                  jsonEdit: false,
                },
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
