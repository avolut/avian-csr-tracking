base(
  {
    meta: () => {
      const meta = {
        form: {},
        roleUser: JSON.parse((window as any).user.get()).role,
        isDone: false,
        csr: {
          id: 0,
          judul: "",
          lokasi: "",
          type: "",
          latitude: 0,
          longitude: 0,
        },
        isTraining: [
          {
            value: "1",
            label: "Ya",
          },
          {
            value: "0",
            label: "Tidak",
          },
        ],
      };
      return meta;
    },
    init: ({ meta }) => {},
  },
  ({ meta }) => (
    <admin
      nav={["csr"]}
      content={{
        csr: {
          table: "t_csr",
          label: "CSR",
          // list header
          list: {
            filter: {
              enable: true,
              web: {
                mode: "topbar",
                selector: true,
              },
              alter: {
                status: {
                  visible: true,
                  type: "select",
                  options: [
                    {
                      key: "Completed",
                      text: "Selesai",
                    },
                    {
                      key: "Draft",
                      text: "Draft",
                    },
                  ],
                },
              },
            },
            action: {
              create: "Tambah",
            },
            table: {
              columns: [
                [
                  "no_kegiatan",
                  {
                    title: "No. Kegiatan",
                  },
                ],
                [
                  "tgl_kegiatan",
                  {
                    title: "Tanggal",
                    value: (row) => globalVar.formatDate(row.tgl_kegiatan),
                  },
                ],
                [
                  "id_pillar",
                  {
                    title: "Pilar",
                    width: 200,
                    value: (item) => {
                      return <span>{item.m_pillar.name}</span>;
                    },
                  },
                ],
                [
                  "id_supplier",
                  {
                    title: "Supply Dari",
                    width: 200,
                    value: (item) => {
                      return <span>{item.m_supplier.nama_supplier}</span>;
                    },
                  },
                ],
                [
                  "_",
                  {
                    title: "Status",
                    width: 200,
                    value: (item) => {
                      const color =
                        item.status === "Completed"
                          ? "bg-green-600 text-white font-semibold rounded-full px-2"
                          : "bg-yellow-500 text-white font-semibold rounded-full px-2";
                      return (
                        <span className={color}>
                          {item.status === "Completed" ? "Selesai" : "Draft"}
                        </span>
                      );
                    },
                  },
                ],
                [
                  "nama_project_csr",
                  {
                    title: "Nama Project",
                  },
                ],
                [
                  "_",
                  {
                    title: "",
                    width: 50,
                    value: (item) => {
                      return (
                        <>
                          {item.status === "Completed" && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                window.open(`/admin/pdf/${item.id}`, "_blank");
                              }}
                              className="bg-green-600 text-white font-semibold rounded-full px-2"
                              style={{
                                width: 50
                              }}
                            >
                              Lihat PDF
                            </button>
                          )}
                        </>
                      );
                    },
                  },
                ],
              ],
            },
            params: {
              include: {
                m_pillar: true,
                m_supplier: true,
                m_divisi: true,
                m_kegiatan: true,
                m_area_tirta: true,
                m_cabang: true,
                m_covered_area: true,
                m_pulau: true,
                m_instansi_penerima: true,
                m_jenis_instansi: true,
              },
              orderBy: {
                id: "desc"
              }
            },
          },
          // form header
          form: {
            onLoad: (data) => {
              meta.isDone = data.status === "Completed" ? true : false;
              meta.csr.id = data.id;
              (meta.csr.judul = data.nama_project_csr),
                (meta.csr.lokasi = data.lokasi);
              meta.csr.type = data.m_pillar.type_web;
              meta.csr.latitude = data.latitude;
              meta.csr.longitude = data.longitude;
            },
            onSave: async ({ data, save }) => {
              if (!data.id) {
                data.created_date = new Date();
                data.created_by = JSON.parse((window as any).user.get()).id;
              }

              if (typeof data.is_training === "string") data.is_training = Number(data.is_training)
              if (typeof data.value_biaya === "string") data.value_biaya = Number(data.value_biaya)
              save();
            },
            params: {
              include: {
                t_csr_detail_bantuan: true,
                t_csr_dokumentasi: true,
                t_csr_fasilitas_lainnya: true,
              },
            },
            action: () => ({
              save: () => {
                if (meta.roleUser === "hrd" && meta.isDone) return false;
                return "Simpan";
              },
              delete: () => {
                if (meta.roleUser === "hrd" && meta.isDone) return false;
                return true;
              },
              jsonEdit: false,
            }),
            alter: {
              m_divisi: {
                title: "Divisi",
                required: true,
              },
              m_pillar: {
                title: "Pilar CSR",
                required: true,
              },
              m_kegiatan: {
                title: "Kegiatan CSR",
                required: true,
                params: (row) => {
                  if (!row.id_pillar) return {};
                  return {
                    where: {
                      id_pillar: row.id_pillar,
                    },
                  };
                },
              },
              is_training: {
                required: false,
                title: "Training",
                type: "select",
                items: meta.isTraining as any,
              },
              value_biaya: {
                suffix: "IDR",
                type: "money",
              },
              nama_project_csr: {
                title: "Nama Project CSR",
              },
              latitude: {
                type: "text",
                onChange: (value, { state }) => {
                  state.db.data.latitude = value.replace(/[^0-9.-]/g, "");
                },
              },
              longitude: {
                type: "text",
                onChange: (value, { state }) => {
                  state.db.data.latitude = value.replace(/[^0-9.-]/g, "");
                },
              },
              m_cabang: {
                params: (row) => {
                  if (!row.id_area_tirta) return {};
                  return {
                    where: {
                      id_area_tirta: row.id_area_tirta,
                    },
                  };
                },
              },
              m_jenis_instansi: {
                params: (row) => {
                  if (!row.id_instansi_penerima) return {};
                  return {
                    where: {
                      id_instansi_penerima: row.id_instansi_penerima,
                    },
                  };
                },
              },
              budget_by: {
                type: "select",
                items: ["Marketing", "Operasional", "Penerima CSR"],
                onChange: (value, {state}) => {
                  console.log(value)
                  if (value === "Penerima CSR") {
                    state.db.data.value_biaya = "0";
                    state.config.fields.value_biaya.state.render();
                  }
                }
              },
              t_csr_fasilitas_lainnya: {
                title: "Penerima Bantuan",
                fieldProps: {
                  list: {
                    action: {
                      create: () => {
                        if (meta.roleUser === "hrd" && meta.isDone)
                          return false;
                        return "Tambah";
                      },
                    },
                    table: {
                      columns: [
                        "m_fasilitas_lainnya.fasilitas",
                        "jumlah",
                        "keterangan",
                      ],
                    },
                    params: {
                      include: {
                        m_fasilitas_lainnya: true,
                      },
                    },
                  },
                  form: {
                    action: () => ({
                      save: () => {
                        if (meta.roleUser === "hrd" && meta.isDone)
                          return false;
                        return "Simpan";
                      },
                      delete: () => {
                        if (meta.roleUser === "hrd" && meta.isDone)
                          return false;
                        return true;
                      },
                      jsonEdit: false,
                    }),
                    layout: [
                      "m_fasilitas_lainnya",
                      ({ row, watch, layout }) => {
                        watch(["m_fasilitas_lainnya"]);
                        if (row.m_fasilitas_lainnya.fasilitas === "Sebutkan")
                          return layout([["jumlah", "keterangan"]]);
                        return layout(["jumlah"]);
                      },
                    ],
                  },
                },
              },
              t_csr_detail_bantuan: {
                title: "Detail Bantuan",
                fieldProps: {
                  list: {
                    action: {
                      create: () => {
                        if (meta.roleUser === "hrd" && meta.isDone)
                          return false;
                        return "Tambah";
                      },
                    },
                    table: {
                      columns: [
                        "bantuan",
                        [
                          "m_product_csr.name",
                          {
                            title: "Merek",
                            value: (row) => {
                              if (row.bantuan === "Cat")
                                return row.m_product_csr.name;
                              return row.merek;
                            },
                          },
                        ],
                        "keterangan",
                        "jumlah",
                        [
                          "harga_nett",
                          {
                            value: (row) => (
                              <div>
                                Rp.
                                {row.harga_nett
                                  .toString()
                                  .replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
                              </div>
                            ),
                          },
                        ],
                      ],
                    },
                    params: {
                      include: {
                        m_jenis_bantuan: true,
                        m_product_csr: true,
                      },
                    },
                  },
                  form: {
                    onInit: (state) => {
                      state.db.data.diskon =
                        100 -
                        (state.db.data.harga_nett * 100) / state.db.data.value;
                    },
                    onSave: ({ data, save }) => {
                      if (!data.diskon) data.diskon = 0;
                      data.harga_nett =
                        typeof data.harga_nett === "string"
                          ? parseInt(data.harga_nett.replace(/\D/g, ""))
                          : data.harga_nett;
                      save();
                    },
                    action: () => ({
                      save: () => {
                        if (meta.roleUser === "hrd" && meta.isDone)
                          return false;
                        return "Simpan";
                      },
                      delete: () => {
                        if (meta.roleUser === "hrd" && meta.isDone)
                          return false;
                        return true;
                      },
                      jsonEdit: false,
                    }),
                    alter: {
                      bantuan: {
                        type: "select",
                        items: ["Cat", "Lainnya"],
                      },
                      warna: {
                        type: "select",
                        items: ["Tinting", "Ready Mix"],
                      },
                      jenis: {
                        type: "select",
                        items: ["Spray", "Solvent Based", "Water Based"],
                      },
                      m_product_csr: {
                        title: "Merek",
                      },
                      harga_nett: {
                        type: "money",
                        readonly: true,
                      },
                      value: {
                        title: "Total Harga (IDR)",
                        type: "money",
                        onChange: (_, { state, row }) => {
                          let v = row.value;
                          let d = 0;
                          if (!row.value) v = 0;
                          if (!!row.diskon) d = row.diskon;
                          if (v === 0 || d === 0)
                            state.db.data.harga_nett = v
                              .toString()
                              .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
                          else
                            state.db.data.harga_nett = Math.round(
                              (v * (100 - d)) / 100
                            )
                              .toString()
                              .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
                          state.config.fields.harga_nett.state.render();
                        },
                      },
                      diskon: {
                        title: "Diskon",
                        suffix: "%",
                        required: false,
                        onChange: (_, { state, row }) => {
                          let d = row.diskon;
                          let v = 0;
                          if (!row.diskon) d = 0;
                          if (!!row.value) v = row.value;
                          if (v === 0 || d === 0)
                            state.db.data.harga_nett = v
                              .toString()
                              .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
                          else
                            state.db.data.harga_nett = Math.round(
                              (v * (100 - d)) / 100
                            )
                              .toString()
                              .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
                          state.config.fields.harga_nett.state.render();
                        },
                      },
                    },
                    layout: [
                      "bantuan",
                      ({ row, watch, layout }) => {
                        // jika bantuan adalah Lainnya maka tampilkan jenis bantuan
                        // jika bantuan adalah Cat maka tampilkan produck csr
                        watch(["bantuan"]);
                        if (row.bantuan === "Cat")
                          return layout([
                            ["m_product_csr"],
                            ["jenis", "warna"],
                            ["jumlah", "value"],
                            ["diskon", "harga_nett"],
                          ]);
                        else if (row.bantuan === "Lainnya") {
                          return layout([[], ["m_jenis_bantuan"]]);
                        }
                        return layout([]);
                      },
                      ({ row, watch, layout }) => {
                        // jika jenis bantuan adalah Lainnya maka tampilkan merek
                        watch(["m_jenis_bantuan"]);
                        if (!row.m_jenis_bantuan.jenis_bantuan)
                          return layout([]);
                        if (row.m_jenis_bantuan.jenis_bantuan === "Lainnya")
                          return layout([["merek", "value"]]);
                        return layout([
                          ["value", "diskon"],
                          ["harga_nett", []],
                        ]);
                      },
                    ],
                  },
                },
              },
              t_csr_dokumentasi: {
                title: "Dokumentasi",
                fieldProps: {
                  list: {
                    action: {
                      create: "Tambah",
                    },
                    table: {
                      columns: [
                        [
                          "url_file",
                          {
                            title: "URL File",
                            width: 400,
                          },
                        ],
                        [
                          "tipe",
                          {
                            value: (row) => {
                              if (row.tipe === "Link") return row.tipe;
                              const mime = row.url_file
                                .split(".")
                                .slice(-1)
                                .pop();
                              if (
                                [
                                  "bmp",
                                  "gif",
                                  "ico",
                                  "jpeg",
                                  "jpg",
                                  "png",
                                  "svg",
                                  "tif",
                                  "tiff",
                                  "webp",
                                ].indexOf(mime) >= 0
                              )
                                return "Image";
                              else if (
                                [
                                  "avi",
                                  "mp4",
                                  "mpeg",
                                  "ogv",
                                  "ts",
                                  "webm",
                                  "3gp",
                                  "3g2",
                                ].indexOf(mime) >= 0
                              )
                                return "Video";
                              return row.tipe;
                            },
                          },
                        ],
                        "caption",
                      ],
                    },
                  },
                  form: {
                    onSave: async ({ data, save, state }) => {
                      if (
                        state.tree.parent.tree.parent.db.data.status === "Draft"
                      ) {
                        if (!!data.tipe && !!data.caption && !!data.url_file) {
                          await db.t_csr.update({
                            data: {
                              status: "Completed",
                            },
                            where: {
                              id: meta.csr.id,
                            },
                          });
                          const { judul, lokasi, type, latitude, longitude } =
                            meta.csr; // Connect API post CSR

                          const postData = {
                            judul,
                            lokasi,
                            type,
                            latitude,
                            longitude,
                          };

                          try {
                            await api("/api/post-csr", postData);
                          } catch (error) {
                            console.log(error);
                          }
                        }
                      }

                      data.created_date = new Date();
                      save();
                    },
                    action: () => ({
                      save: "Simpan",
                      jsonEdit: false,
                    }),
                    alter: {
                      url_file: {
                        type: "file",
                      },
                      caption: {
                        type: "multiline",
                      },
                      tipe: {
                        type: "select",
                        items: ["Link", "File"],
                      },
                    },
                    layout: [
                      "tipe",
                      ({ row, watch, update, layout, state }) => {
                        watch(["tipe"]);
                        if (!row.tipe) return layout([]);

                        if (!!state.config.fields.url_file) {
                          if (row.tipe === "Link")
                            state.config.fields.url_file.state.type = "text";
                          else state.config.fields.url_file.state.type = "file";
                        }

                        return layout(["url_file"]);
                      },
                      "caption",
                    ],
                  },
                },
              },
            },
            // layout header
            layout: [
              ["m_divisi", "m_pillar"],
              ["m_kegiatan", "is_training", "tgl_kegiatan"],
              ["nama_project_csr"],
              ["m_supplier"],
              ({ row, watch, layout }) => {
                watch(["m_supplier"]);
                if (row?.m_supplier?.nama_supplier === "PT Avia Avian")
                  return layout([[], ["m_cabang", "m_covered_area"]]);
                return layout([
                  ["m_area_tirta"],
                  ["m_cabang", "m_covered_area"],
                ]);
              },
              ["m_pulau", "lokasi"],
              ["longitude", "latitude"],
              ["deskripsi_singkat"],
              ["budget_by", "value_biaya"],
              ["m_instansi_penerima", "m_jenis_instansi"],
              ({ row, watch, layout }) => {
                watch(["m_jenis_instansi"]);
                if (row?.m_jenis_instansi?.jenis_instansi === "Sebutkan")
                  return layout([
                    ["jumlah_orang", "keterangan"],
                    [],
                    [],
                    [],
                    [],
                    [],
                  ]);
                return layout([["jumlah_orang", []], [], [], [], [], []]);
              },
              [
                "t_csr_fasilitas_lainnya",
                "t_csr_detail_bantuan",
                "t_csr_dokumentasi",
              ],
            ],
          },
        },
      }}
    />
  )
);
