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
    <>
      <>
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
                  },
                },
              },
              form: {
                params: {
                  include: {
                    m_pillar: true,
                    m_supplier: true,
                    m_divisi: true,
                    m_kegiatan: true,
                    m_area_cabang: true,
                    m_cabang: true,
                    m_covered_area: true,
                    m_pulau: true,
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
                    title: "Fasilitas Lainnya"
                  },
                  t_csr_detail_bantuan: {
                    title: 'Detail Bantuan',
                    fieldProps: {
                      list: {
                        table: {
                          columns: [
                            [
                              "bantuan",
                              {
                                title: "Bantuan",
                              },
                            ],
                            [
                              "merek",
                              {
                                title: "Merek",
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
                      },
                    },
                  },
                },
                layout: [
                  "m_divisi",
                  [
                    <div>
                      <span class="font-bold text-base">
                        Tentang Kegiatan CSR
                      </span>
                    </div>,
                  ],
                  "m_pillar",
                  "m_kegiatan",
                  ["is_training", "tgl_kegiatan"],
                  "nama_project_csr",
                  "m_supplier",
                  ["m_area_tirta", "m_cabang"],
                  "m_covered_area",
                  ["m_pulau", "lokasi"],
                  ["longitude", "latitude"],
                  ["deskripsi_singkat"],
                  ["budget_by", "value_biaya"],
                  [["t_csr_detail_bantuan", "t_csr_fasilitas_lainnya", "t_csr_dokumentasi"]]
                ],
              },
            },
          }}
        />
      </>
    </>
  )
);
