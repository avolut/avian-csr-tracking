base(
  {
    meta: {
      form: {},
      roleUser: (window as any).user.role,
      isDone: false,
      isTraining: [
        {
          value: 'Y',
          label: 'Ya',
        },
        {
          value: 'N',
          label: 'Tidak',
        },
      ],
    },
    init: ({ meta }) => {},
  },
  ({ meta }) => (
    <admin
      nav={['csr']}
      content={{
        csr: {
          table: 't_csr',
          label: 'CSR',
          // list header
          list: {
            action: {
              create: 'Tambah',
            },
            table: {
              columns: [
                [
                  'no_kegiatan',
                  {
                    title: 'No. Kegiatan',
                  },
                ],
                [
                  'tgl_kegiatan',
                  {
                    title: 'Tanggal',
                    value: (row) => globalVar.formatDate(row.tgl_kegiatan),
                  },
                ],
                [
                  'id_pillar',
                  {
                    title: 'Pilar',
                    width: 200,
                    value: (item) => {
                      return <span>{item.m_pillar.name}</span>
                    },
                  },
                ],
                [
                  'id_supplier',
                  {
                    title: 'Supply Dari',
                    width: 200,
                    value: (item) => {
                      return <span>{item.m_supplier.nama_supplier}</span>
                    },
                  },
                ],
                [
                  'is_training',
                  {
                    title: 'Status',
                    width: 200,
                    value: (item) => {
                      const color =
                        item.is_training === 'Y'
                          ? 'bg-green-600 text-white font-semibold rounded-full px-2'
                          : 'bg-yellow-500 text-white font-semibold rounded-full px-2'
                      return (
                        <span class={color}>
                          {item.is_training === 'Y' ? 'Selesai' : 'Draft'}
                        </span>
                      )
                    },
                  },
                ],
                [
                  'nama_project_csr',
                  {
                    title: 'Nama Project',
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
            },
          },
          // form header
          form: {
            onLoad: (data) => {
              // console.log(data.is_training);
              meta.isDone = data.is_training === 'Y' && true
            },
            onSave: ({ data, save }) => {
              const random = (length) => {
                let result = ''
                let characters =
                  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
                let charactersLength = characters.length
                for (let i = 0; i < length; i++) {
                  result += characters.charAt(
                    Math.floor(Math.random() * charactersLength)
                  )
                }
                return result
              }

              data.no_kegiatan = random(8)
              data.created_date = new Date()
              data.created_by = (window as any).user.id
              save()
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
                if (meta.roleUser === 'hrd' && !meta.isDone) return false

                if (meta.roleUser !== 'hrd') return 'Simpan'

                return 'Simpan'
              },
              delete: () => {
                if (meta.roleUser === 'hrd' && !meta.isDone) return false

                if (meta.roleUser !== 'hrd') return true

                return true
              },
              jsonEdit: false,
            }),
            alter: {
              m_divisi: {
                title: 'Divisi',
                required: true,
              },
              m_pillar: {
                title: 'Pilar CSR',
                required: true,
              },
              m_kegiatan: {
                title: 'Kegiatan CSR',
                required: true,
              },
              is_training: {
                title: 'Training',
                type: 'select',
                items: meta.isTraining,
              },
              value_biaya: {
                suffix: 'IDR',
                type: 'money',
              },
              nama_project_csr: {
                title: 'Nama Project CSR',
              },
              latitude: {
                type: 'text',
                onChange: (value, { state }) => {
                  state.db.data.latitude = value.replace(/[^0-9.-]/g, '')
                },
              },
              longitude: {
                type: 'text',
                onChange: (value, { state }) => {
                  state.db.data.latitude = value.replace(/[^0-9.-]/g, '')
                },
              },
              m_cabang: {
                params: (row) => {
                  if (!row.id_area_tirta) return {}
                  return {
                    where: {
                      id_area_tirta: row.id_area_tirta,
                    },
                  }
                },
              },
              m_jenis_instansi: {
                params: (row) => {
                  if (!row.id_instansi_penerima) return {}
                  return {
                    where: {
                      id_instansi_penerima: row.id_instansi_penerima,
                    },
                  }
                },
              },
              budget_by: {
                type: 'select',
                items: ['Marketing', 'Operasional', 'Penerima CSR'],
              },
              t_csr_fasilitas_lainnya: {
                title: 'Penerima Bantuan',
                fieldProps: {
                  list: {
                    action: {
                      create: 'Tambah',
                    },
                    table: {
                      columns: [
                        'm_fasilitas_lainnya.fasilitas',
                        'jumlah',
                        'keterangan',
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
                      save: 'Simpan',
                      jsonEdit: false,
                    }),
                    layout: [
                      'm_fasilitas_lainnya',
                      ({ row, watch, layout }) => {
                        watch(['m_fasilitas_lainnya'])
                        if (row.m_fasilitas_lainnya.fasilitas === 'Sebutkan')
                          return layout([['jumlah', 'keterangan']])
                        return layout(['jumlah'])
                      },
                    ],
                  },
                },
              },
              t_csr_detail_bantuan: {
                title: 'Detail Bantuan',
                fieldProps: {
                  list: {
                    action: {
                      create: 'Tambah',
                    },
                    table: {
                      columns: [
                        'bantuan',
                        [
                          'm_product_csr.name',
                          {
                            title: 'Merek',
                            value: (row) => {
                              if (row.bantuan === 'Cat')
                                return row.m_product_csr.name
                              return row.merek
                            },
                          },
                        ],
                        'keterangan',
                        'jumlah',
                        [
                          'harga_nett',
                          {
                            value: (row) => (
                              <div>
                                Rp.
                                {row.harga_nett
                                  .toString()
                                  .replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
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
                    onSave: ({ data, save }) => {
                      if (!data.harga_nett) data.harga_nett = 0
                      save()
                    },
                    action: () => ({
                      save: 'Simpan',
                      jsonEdit: false,
                    }),
                    alter: {
                      bantuan: {
                        type: 'select',
                        items: ['Cat', 'Lainnya'],
                      },
                      warna: {
                        type: 'select',
                        items: ['Tinting', 'Ready Mix'],
                      },
                      jenis: {
                        type: 'select',
                        items: ['Spray', 'Solvent Based', 'Water Based'],
                      },
                      m_product_csr: {
                        title: 'Merek',
                      },
                      harga_nett: {
                        type: 'money',
                      },
                      value: {
                        title: 'Value (IDR)',
                        type: 'money',
                      },
                    },
                    layout: [
                      'bantuan',
                      ({ row, watch, layout }) => {
                        // jika bantuan adalah Lainnya maka tampilkan jenis bantuan
                        // jika bantuan adalah Cat maka tampilkan produck csr
                        watch(['bantuan'])
                        if (row.bantuan === 'Cat')
                          return layout([
                            ['m_product_csr'],
                            ['jenis', 'warna'],
                            ['jumlah', 'value'],
                          ])
                        else if (row.bantuan === 'Lainnya') {
                          return layout([[], ['m_jenis_bantuan']])
                        }
                        return layout([])
                      },
                      ({ row, watch, layout }) => {
                        // jika jenis bantuan adalah Lainnya maka tampilkan merek
                        watch(['m_jenis_bantuan'])
                        if (!row.m_jenis_bantuan.jenis_bantuan)
                          return layout([])
                        if (row.m_jenis_bantuan.jenis_bantuan === 'Lainnya')
                          return layout([['merek', 'value']])
                        return layout([['value', []]])
                      },
                    ],
                  },
                },
              },
              t_csr_dokumentasi: {
                title: 'Dokumentasi',
                fieldProps: {
                  list: {
                    action: {
                      create: 'Tambah',
                    },
                    table: {
                      columns: [
                        ['url_file', { title: 'URL File', width: 400 }],
                        [
                          'tipe',
                          {
                            value: (row) => {
                              if (row.tipe === 'Link') return row.tipe
                              const mime = row.url_file
                                .split('.')
                                .slice(-1)
                                .pop()
                              if (
                                [
                                  'bmp',
                                  'gif',
                                  'ico',
                                  'jpeg',
                                  'jpg',
                                  'png',
                                  'svg',
                                  'tif',
                                  'tiff',
                                  'webp',
                                ].indexOf(mime) >= 0
                              )
                                return 'Image'
                              else if (
                                [
                                  'avi',
                                  'mp4',
                                  'mpeg',
                                  'ogv',
                                  'ts',
                                  'webm',
                                  '3gp',
                                  '3g2',
                                ].indexOf(mime) >= 0
                              )
                                return 'Video'
                              return row.tipe
                            },
                          },
                        ],
                        'caption',
                      ],
                    },
                  },
                  form: {
                    onSave: ({ data, save }) => {
                      data.created_date = new Date()
                      save()
                    },
                    action: () => ({
                      save: 'Simpan',
                      jsonEdit: false,
                    }),
                    alter: {
                      url_file: {
                        type: 'file',
                      },
                      caption: {
                        type: 'multiline',
                      },
                      tipe: {
                        type: 'select',
                        items: ['Link', 'File'],
                      },
                    },
                    layout: [
                      'tipe',
                      ({ row, watch, update, layout, state }) => {
                        watch(['tipe'])
                        if (!row.tipe) return layout([])
                        if (!!state.config.fields.url_file) {
                          if (row.tipe === 'Link')
                            state.config.fields.url_file.state.type = 'text'
                          else state.config.fields.url_file.state.type = 'file'
                        }
                        return layout(['url_file'])
                      },
                      'caption',
                    ],
                  },
                },
              },
            },
            // layout header
            layout: [
              ['m_divisi', 'm_pillar'],
              ['m_kegiatan', 'is_training', 'tgl_kegiatan'],
              ['nama_project_csr'],
              ['m_supplier'],
              ({ row, watch, layout }) => {
                watch(['m_supplier'])
                if (row?.m_supplier?.nama_supplier === 'PT Avia Avian')
                  return layout([[], ['m_cabang', 'm_covered_area']])
                return layout([
                  ['m_area_tirta'],
                  ['m_cabang', 'm_covered_area'],
                ])
              },
              ['m_pulau', 'lokasi'],
              ['longitude', 'latitude'],
              ['deskripsi_singkat'],
              ['budget_by', 'value_biaya'],
              ['m_instansi_penerima', 'm_jenis_instansi'],
              ({ row, watch, layout }) => {
                watch(['m_jenis_instansi'])
                if (row?.m_jenis_instansi?.jenis_instansi === 'Lainnya')
                  return layout([
                    ['jumlah_orang', 'keterangan'],
                    [],
                    [],
                    [],
                    [],
                    [],
                  ])
                return layout([['jumlah_orang', []], [], [], [], [], []])
              },
              [
                't_csr_fasilitas_lainnya',
                't_csr_detail_bantuan',
                't_csr_dokumentasi',
              ],
            ],
          },
        },
      }}
    />
  )
)
