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
          nav={["area"]}
          content={{
            "Area Tirta": {
              table: "m_area_tirta",
              label: "Area Tirta",
              list: {
                table: {
                  columns: [
                    [
                      "nama_area_tirta",
                      {
                        title: "Nama Area Tirta",
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
                  nama_area_tirta: {
                    title: "Nama Area Tirta",
                    type: "text",
                    required: true,
                  },
                },
                layout: ["nama_area_tirta"],
              },
            },
          }}
        />
      </>
    </>
  )
);
