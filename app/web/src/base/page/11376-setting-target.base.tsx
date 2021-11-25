base(
  {
    meta: {},
    init: ({ meta }) => { },
  },
  ({ meta }) => (
      <admin
        nav={["setting_target"]}
        content={{
          "Setting Target": {
            table: "m_setting_target",
            label: "Setting Target",
            list: {
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
                    "target",
                    {
                      title: "Target",
                    },
                  ],
                  [
                    "bantuan",
                    {
                      title: "Bantuan",
                    },
                  ],
                  [
                    "periode",
                    {
                      title: "Periode",
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
              create: {
                title: "Tambah",
              },
              action: {
                jsonEdit: false,
              },
              alter: {
                target: {
                  title: "Target",
                  type: "text",
                  required: true,
                },
              },
              layout: ["m_instansi_penerima", "target", "bantuan", "periode"],
            },
          },
        }}
      />
  )
);
