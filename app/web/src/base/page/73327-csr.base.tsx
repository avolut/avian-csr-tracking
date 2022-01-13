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
                  "m_pillar.name",
                  {
                    title: "Pilar",
                    width: 120,
                  },
                ],
                [
                  "_",
                  {
                    title: "Status",
                    width: 100,
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
                    width: 350,
                  },
                ],
                [
                  "_",
                  {
                    title: "",
                    width: 100,
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
                              css={css`width: 100px;`}
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
                m_divisi: true,
                m_kegiatan: true,
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
              data.budget_by = "";
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
                t_csr_biaya_support:true,
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
                        [
                          "bantuan", 
                          {
                            title: "Jenis Bantuan",
                            value: (row) => {
                              if (row.bantuan === "Lainnya") {
                                if (!row.m_jenis_bantuan) return ""
                                return row.m_jenis_bantuan.jenis_bantuan;
                              }
                              return row.bantuan;
                            },
                          }
                        ],
                        [
                          "m_product_csr",
                          {
                            title: "Merek",
                            value: (row) => {
                              if (row.bantuan === "Cat") {
                                if (!row.m_product_csr) return ""
                                return row.m_product_csr.name;
                              }
                              return row.merek;
                            },
                          },
                        ],
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
                        [
                          "id_supplier", 
                          {
                            title: "Supply Dari", 
                            width:200, 
                            value: (item)=>{
                              return <span>{item.m_supplier?.nama_supplier}</span>
                            }
                          }
                        ]
                      ],
                    },
                    params: {
                      include: {
                        m_jenis_bantuan: true,
                        m_product_csr: true,
                        m_area_tirta: true, 
                        m_cabang: true, 
                        m_supplier:true
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
                      if (data.bantuan === "Cat") {
                        data.m_jenis_bantuan = {}

                        data.harga_nett =
                        typeof data.harga_nett === "string"
                          ? parseInt(data.harga_nett.replace(/\D/g, ""))
                          : data.harga_nett;
                      } else {
                        data.m_product_csr = {}
                        data.jenis = ""
                        data.warna = ""
                        data.jumlah = 0
                        data.diskon = 0;
                        data.harga_nett = data.value
                        if (data.m_jenis_bantuan.jenis_bantuan !== "Lainnya") {
                          data.merek = ""
                        }
                      }
                      
                      save(data);
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
                        onChange: (value, {state}) => {
                          if (value === "Cat" && !!state.config.fields.m_jenis_bantuan) {
                            state.db.data.m_jenis_bantuan = {}
                            state.config.fields.m_jenis_bantuan.state.render();
                          }
                        }
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
                      merek:{
                        title: "Merek/Jenis"
                      },
                      m_cabang:{
                        title: "Cabang", 
                        params:(row)=>{
                          if(!row.id_area_tirta && row.id_supplier!="PT Tirtakencana Tatawarna") return {};
                          return {
                            where:{
                              id_area_tirta: row.id_area_tirta
                            }
                          }
                        }
                      }, 
                      m_area_tirta:{
                        title: "Area Tirta"
                      },
                      m_supplier:{
                        title: "Supplier",
                        onChange: (value, {state}) => {
                          if(!!state.db.data.id_area_tirta){
                            state.db.data.id_area_tirta = {}
                            if(!!state.config.fields.m_area_tirta){
                              state.db.data.m_area_tirta = {}
                              state.config.fields.m_area_tirta.state.render();
                            }
                          }

                          if(!!state.db.data.id_cabang){
                            state.db.data.id_cabang = {}
                            if(!!state.config.fields.m_cabang){
                              state.db.data.m_cabang = {}
                              state.config.fields.m_cabang.state.render();
                            }
                          }
                        }
                      },
                      harga_nett: {
                        type: "money",
                        readonly: true,
                      },
                      value: {
                        title: "Total Harga (IDR)",
                        type: "money",
                        onChange: (_, { state, row }) => {
                          if (!state.config.fields.harga_nett) return;
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
                      ({ row, watch, layout, state }) => {
                        // jika bantuan adalah Lainnya maka tampilkan jenis bantuan
                        // jika bantuan adalah Cat maka tampilkan produck csr
                        watch(["bantuan"]);
                        if (row.bantuan === "Cat") {
                          return layout([
                            ["m_supplier"],
                            ({row, watch, layout})=>{
                              watch(['m_supplier']);
                              if(row?.m_supplier?.nama_supplier === "PT Tirtakencana Tatawarna")
                                return layout([
                                  ["m_area_tirta", "m_cabang"]
                                ])
                              return layout(["m_cabang"])
                            },
                            ["m_product_csr"],
                            ["jenis", "warna"],
                            ["jumlah", "value"],
                            ["diskon", "harga_nett"],
                          ]);
                        } else if (row.bantuan === "Lainnya") {
                          return layout([["m_jenis_bantuan"], ["m_supplier"]]);
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
                          ["value", []],
                        ]);
                      },
                    ],
                  },
                },
              },
              t_csr_biaya_support: {
                title: "Detail Biaya Support",
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
                        "jenis_biaya",
                        [
                          "total_harga",
                          {
                            title:"Total Biaya",
                            value: (row) => (
                              <div>
                                Rp.
                                {row.total_harga
                                  .toString()
                                  .replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
                              </div>
                            ),
                          },
                        ],
                        [
                          "m_supplier", 
                          {
                            title: "Supply Dari", 
                            width:200, 
                            value: (row)=>{
                              if (row.id_supplier === null) {
                                return row.note;
                              }
                              return row.m_supplier?.nama_supplier;
                            }
                          }
                        ]
                      ],
                    },
                    params: {
                      include: {
                        m_supplier:true
                      },
                    },
                  },
                  form: {
                    onSave: ({ data, save }) => {
                      if (data.jenis_biaya === "Lainnya") {
                        data.m_supplier = {}
                        data.id_supplier = null
                      } else {
                        data.note = ""
                      }
                      save(data);
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
                      jenis_biaya: {
                        type: "select",
                        items: ["Dokumentasi", "Branding", "Lainnya"],
                        onChange: (value, {state}) => {
                          if (value !== "Lainnya" && !!state.config.fields.m_supplier) {
                            state.db.data.m_supplier = {}
                            state.config.fields.m_supplier.state.render();
                          }
                        }
                      },
                      total_harga: {
                        title: "Total Biaya",
                        type: "money",
                      },
                      note:{
                        title: "Supplier"
                      }, 
                      m_supplier:{
                        title: "Supplier"
                      }
                    },
                    layout: [
                      "jenis_biaya",
                      "total_harga",
                      ({ row, watch, layout, state }) => {
                        // jika biaya adalah Lainnya maka tampilkan note untuk supplier free text
                        // jika bantuan adalah selain Lainnya, maka tampilkan dropdown supplier
                        watch(["jenis_biaya"]);
                        if (row.jenis_biaya === "Lainnya") {
                          return layout([
                            "note"
                          ]);
                        }
                        return layout(["m_supplier"]);
                      }
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
              ["m_pulau", "lokasi"],
              ["longitude", "latitude"],
              ["deskripsi_singkat"],
              ["m_instansi_penerima", "m_jenis_instansi"],
              ({ row, watch, update, layout, state }) => {
                watch(["m_jenis_instansi"]);
                if (!!row.m_jenis_instansi && row.m_jenis_instansi.jenis_instansi === "Sebutkan") return layout([["keterangan", "jumlah_orang"]]);
                return layout([["jumlah_orang", []]]);
              },
              [
                "t_csr_fasilitas_lainnya",
                "t_csr_detail_bantuan",
                "t_csr_biaya_support",
                "t_csr_dokumentasi",
              ],
            ],
          },
        },
      }}
    />
  )
);
