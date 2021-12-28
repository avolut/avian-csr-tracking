/** @jsx jsx */
import { jsx, css } from '@emotion/react'
import { Pdf } from 'web-view/src/Pdf'
import { db } from 'libs'
import { useEffect } from 'react'
import { observer, useLocalObservable } from 'mobx-react-lite'
import RenderHTML from 'web-utils/components/RenderHTML'

const PDFReader = ({ csrId }) => {
  const state = useLocalObservable(() => ({
    csr: {} as any,
    loading: true as boolean,
  }))

  useEffect(() => {
    loadCsr()
  }, [])

  const loadCsr = async () => {
    const res = await db.t_csr.findFirst({
      // select: {
      //   no_kegiatan: true,
      //   tgl_kegiatan: true,
      //   nama_project_csr: true,
      //   lokasi: true,
      //   jumlah_orang: true,
      //   deskripsi_singkat: true,
      //   m_pillar: { select: { name: true } },
      //   m_supplier: { select: { nama_supplier: true } },
      //   m_instansi_penerima: { select: { instansi_penerima: true } },
      //   t_csr_detail_bantuan: {
      //     select: {
      //       harga_nett: true,
      //       bantuan: true,
      //       merek: true,
      //       jenis: true,
      //       jumlah: true,
      //       m_product_csr: true,
      //     },
      //   },
      // },
      where: { id: csrId },
      include: {
        m_pillar: true,
        m_supplier: true,
        m_instansi_penerima: true,
        t_csr_detail_bantuan: {
          include: {
            m_product_csr: true,
          },
        },
      },
    })

    runInAction(() => {
      state.csr = res
      state.loading = false
    })
  }

  const pdfContent = [
    { label: 'Nomor Kegiatan CSR', value: ': ' + state.csr?.no_kegiatan },
    {
      label: 'Tanggal-Bulan-Tahun',
      value: ': ' + globalVar.formatDate(state.csr?.tgl_kegiatan),
    },
    { label: 'Pilar CSR', value: ': ' + state.csr?.m_pillar?.name },
    { label: 'Nama Project CSR', value: ': ' + state.csr?.nama_project_csr },
    { label: 'Lokasi', value: ': ' + state.csr?.lokasi },
    {
      label: 'Supply Dari',
      value: ': ' + state.csr?.m_supplier?.nama_supplier,
    },
  ]
  return (
    <div
      className="h-full"
      css={css`
        & div {
          height: 100%;
        }
      `}
    >
      <Pdf loading={state.loading}>
        <div className="mx-4">
          {pdfContent.map((item, idx) => (
            <div key={idx} className="flex justify-between mt-4 text-sm">
              <div className="font-semibold">{item.label}</div>
              <div className="text-left w-2/3">{item.value}</div>
            </div>
          ))}
          <div className="border-t border-b my-2 pb-2 text-sm">
            <div className="flex mt-4 justify-between">
              <div className="font-semibold">Instansi Penerima</div>
              <div className="text-left w-2/3">
                : {state.csr?.m_instansi_penerima?.instansi_penerima}
              </div>
            </div>
            <div className="flex mt-4  justify-between">
              <div className="font-semibold">Penerima Manfaat</div>
              <div className="text-left w-2/3">
                : {globalVar.numberFormat(state.csr?.jumlah_orang)} Orang
              </div>
            </div>
          </div>
          <div className="font-semibold py-3">Bantuan CSR</div>
          <table className="w-full border text-sm">
            <thead>
              <tr className="text-left">
                <th className="p-3">Jenis</th>
                <th>Merek</th>
                <th>Keterangan</th>
                <th>Biaya</th>
                <th>Jumlah</th>
              </tr>
            </thead>
            <tbody>
              {state.csr?.t_csr_detail_bantuan?.map((item, idx) => (
                <tr key={idx} className="border-t">
                  <td className="p-3">{item.bantuan}</td>
                  <td>{item.bantuan === "Cat" ? (!!item.m_product_csr ? item.m_product_csr.name : "") : item.merek}</td>
                  <td>{item.jenis}</td>
                  <td>Rp {globalVar.currencyFormat(item.harga_nett)}</td>
                  <td>{item.jumlah}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="font-semibold py-3">Total Bantuan</div>
          <div className="border-t border-b my-2 pb-2 text-sm">
            <div className="flex justify-between mt-4">
              <div className="font-semibold">Biaya</div>
              <div className="text-left w-2/3">
                : Rp{' '}
                {globalVar.currencyFormat(
                  state.csr?.t_csr_detail_bantuan?.reduce(
                    (acc, curr) => acc + curr.harga_nett,
                    0
                  )
                )}
              </div>
            </div>
            <div className="flex justify-between mt-4">
              <div className="font-semibold">Cat</div>
              <div className="text-left w-2/3">
                :{' '}
                {globalVar.numberFormat(
                  state.csr?.t_csr_detail_bantuan?.reduce(
                    (acc, curr) => acc + curr.jumlah,
                    0
                  )
                )}{' '}
                Kg
              </div>
            </div>
          </div>

          <div className="font-semibold py-3">Deskripsi Singkat</div>
          <div className="text-sm">
            <RenderHTML>{state.csr?.deskripsi_singkat}</RenderHTML>
          </div>
        </div>
      </Pdf>
    </div>
  )
}

export default observer(PDFReader)
