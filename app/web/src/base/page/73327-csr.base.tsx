base(
  {
    meta: {
      form: {},
      isTraining: [
        {
          value: "Y",
          label: "Ya",
        },
        {
          value: "N",
          label: "Tidak",
        },
      ],
    },
    init: ({ meta }) => { },
  },
  ({ meta }) => (
    <admin
      nav={["csr"]}
      content={{
        csr: {
          table: "t_csr",
          label: "CSR",
          list: {
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
                  "is_training",
                  {
                    title: "Status",
                    width: 200,
                    value: (item) => {
                      const color =
                        item.is_training === "Y"
                          ? "text-green-300"
                          : "text-yellow-400";
                      return (
                        <span class={color}>
                          {item.is_training === "Y" ? "Selesai" : "Draft"}
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
                m_jenis_instansi: true
              },
            },
          },
          form: {
            params: {
              include: {
                t_csr_detail_bantuan: true,
                t_csr_dokumentasi: true,
                t_csr_fasilitas_lainnya: true
              },
            },
            create: {
              title: "Tambah",
            },
            action: {
              jsonEdit: false,
            },
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
              },
              tgl_kegiatan: {
                title: "Tanggal Kegiatan",
                required: true,
              },
              is_training: {
                title: "Training",
                type: "select",
                items: meta.isTraining,
              },
              value_biaya: {
                suffix: "IDR",
                type: "money",
              },
              t_csr_fasilitas_lainnya: {
                title: "Fasilitas Lainnya",
                fieldProps: {
                  list: {
                    table: {
                      columns: [
                        "m_fasilitas_lainnya.fasilitas", "jumlah", "keterangan"
                      ]
                    },
                    params: {
                      include: {
                        m_fasilitas_lainnya: true
                      }
                    }
                  },
                  form: {
                    layout: [["m_fasilitas_lainnya", "jumlah"], "keterangan"]
                  }
                }
              },
              t_csr_detail_bantuan: {
                title: 'Detail Bantuan',
                fieldProps: {
                  list: {
                    table: {
                      columns: [
                        "bantuan",
                        "merek",
                        "keterangan",
                        "jumlah",
                        ["harga_nett", {
                          value: (a) => <div>Rp.{a.harga_nett
                            .toString()
                            .replace(/\B(?=(\d{3})+(?!\d))/g, '.')}</div>
                        }]
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
                      bantuan: {
                        type: "select",
                        items: ["Cat", "Lainnya"]
                      },
                      warna: {
                        type: "select",
                        items: ["Tinting", "Ready Mix", "Spray"]
                      },
                      m_product_csr: {
                        title: "Produk CSR"
                      },
                      harga_nett: {
                        type: "money"
                      }
                    },
                    layout: [
                      ["bantuan", ({
                        row,
                        watch,
                        update,
                        layout,
                        state,
                      }) => {
                        watch(['bantuan'])
                        if (row.bantuan === "Cat") return layout(["m_product_csr"])
                        else if (row.bantuan === "Lainnya") return layout(["m_jenis_bantuan"])
                        return layout([])
                      }],
                      ["jumlah", "merek"],
                      ["jenis", "warna"],
                      ["value", "harga_nett"],
                    ]
                  },
                },
              },
              t_csr_dokumentasi: {
                title: "Dokumentasi",
                fieldProps: {
                  list: {
                    table: {
                      columns: ["url_file", "caption"]
                    }
                  },
                  form: {
                    alter: {
                      url_file: {
                        type: "file"
                      },
                      caption: {
                        type: "multiline"
                      },
                      tipe: {
                        type: "select",
                        items: ["Link", "File"]
                      }
                    },
                    layout: [
                      ["tipe", ({
                        row,
                        watch,
                        update,
                        layout,
                        state,
                      }) => {
                        return layout(["url_file"])
                      }], "caption"
                    ]
                  }
                }
              },
            },
            layout: [
              ["m_divisi", "m_pillar"],
              ["m_kegiatan", "is_training", "tgl_kegiatan"],
              ["nama_project_csr"],
              ["m_supplier"],
              ["m_area_tirta", "m_cabang", "m_covered_area"],
              ["m_pulau", "lokasi"],
              ["longitude", "latitude"],
              ["deskripsi_singkat"],
              ["budget_by", "value_biaya"],
              ["m_instansi_penerima", "m_jenis_instansi"],
              ["keterangan", "jumlah_orang"],
              ["t_csr_fasilitas_lainnya", "t_csr_detail_bantuan", "t_csr_dokumentasi"]
            ],
          },
        },
      }}
    />
  )
);
