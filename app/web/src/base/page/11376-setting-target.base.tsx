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
                  "periode",
                  {
                    title: "Periode",
                  },
                ],
                [
                  "bantuan",
                  {
                    title: "Jenis Target",
                    width: 200,
                    value: (item) => {
                      if (item.bantuan === "Target Lembaga") {
                        if (!item.m_instansi_penerima) return ""
                        return item.m_instansi_penerima.instansi_penerima;
                      }
                      return item.bantuan;
                    },
                  },
                ],
                [
                  "target",
                  {
                    title: "Jumlah Target",
                    value: (item) => {
                      if (item.bantuan === "Target Cat") {
                        return item.target + " kg";
                      } else if (item.bantuan === "Target Lembaga") {
                        return item.target + " lembaga";
                      }
                      return item.target;
                    },
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
                title: "Jumlah Target",
                type: "number",
                required: true,
              },
              bantuan: {
                type: "select",
                title: "Jenis Target",
                items: ["Target Cat", "Target Lembaga"],
                required: true,
                onChange: (value, {state}) => {
                  if (value === "Target Lembaga" && !!state.config.fields.m_instansi_penerima) {
                    state.db.data.m_instansi_penerima = {}
                    state.config.fields.m_instansi_penerima.state.render();
                  }
                }
              },
            },
            layout: [
              "periode", 
              "bantuan", 
              ({ row, watch, layout, state }) => {
                // jika bantuan adalah Lainnya maka tampilkan instansi penerima
                watch(["bantuan"]);
                if (row.bantuan === "Target Lembaga") {
                  return layout([
                    ["m_instansi_penerima"]
                  ]);
                }
                return layout([]);
              },
              "target", 
            ],
          },
        },
      }}
    />
  )
);
