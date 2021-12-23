base(
  {
    meta: () => {
      const meta = {};
      return meta;
    },
    init: ({ meta }) => {},
  },
  ({ meta }) => (
    <admin
      nav={["setting_target"]}
      content={{
        "Setting Target": {
          table: "m_setting_target",
          label: "Setting Target",
          list: {
            action: {
              create: "Tambah",
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
            action: () => ({
              save: "Simpan",
              jsonEdit: false,
            }),
            alter: {
              target: {
                title: "Target",
                type: "number",
                required: true,
              },
              bantuan: {
                title: "Bantuan",
                type: "select",
                required: true,
                items: ["Bantuan Cat", "Bantuan Lainnya"],
              },
            },
            layout: ["m_instansi_penerima", "target", "bantuan", "periode"],
          },
        },
      }}
    />
  )
);
