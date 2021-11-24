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
          nav={["covered"]}
          content={{
            "Covered Area": {
              table: "m_covered_area",
              label: "Covered Area",
              list: {
                table: {
                  columns: [
                    [
                      "nama_covered_area",
                      {
                        title: "Covered Area",
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
                  nama_covered_area: {
                    title: "Covered Area",
                    type: "text",
                    required: true,
                  },
                },
                layout: ["nama_covered_area"],
              },
            },
          }}
        />
      </>
    </>
  )
);
