/** @jsx jsx */
import { jsx, css } from '@emotion/react'
import { observer } from 'mobx-react-lite'

export default observer(({ user }: any) => {
  return (
    <div
      className="w-full flex self-stretch flex-col items-start justify-start border border-indigo-50 overflow-y-auto"
      css={css`
        background: linear-gradient(178.29deg, #0d6d68 59.99%, #52b949 98.55%);
        background-size: 100% 100%;
        background-repeat: no-repeat;
        height: 100%;
      `}
    >
      <div className="flex self-stretch items-start justify-start p-2.5 ">
        <div className="flex flex-1 flex-row items-center justify-center p-2.5">
          <img
            src="/fimgs/452_4938.x1.png"
            css={css`
              margin-right: 10px;
            `}
          />
          <div className="text-lg font-bold leading-normal text-white">
            CSR TRACKING
          </div>
        </div>
      </div>

      {!!user && (
        <div className="flex flex-1 self-stretch flex-col items-start justify-start">
          <div className="w-full p-2.5 mb-2">
            <div
              className="w-full p-2.5 rounded-md flex flex-row justify-between items-center"
              css={css`
                background: #115e59;
              `}
            >
              <div className="text-white text-sm">{user.name}</div>
              <img src="/fimgs/483_5894.x1.svg" />
            </div>
          </div>
          <div className="flex flex-col flex-1 w-full mb-10">
            {['admin'].includes(user.role) && (
              <div className="flex self-stretch items-center justify-start px-2.5">
                <img src="/fimgs/dashboard.x1.svg" />
                <button
                  className="flex flex-1 space-x-1 items-center justify-start p-2.5"
                  onClick={() => (window as any).navigate('/admin/dashboard')}
                >
                  <div className="text-sm leading-tight text-white">
                    Dashboard
                  </div>
                </button>
              </div>
            )}
            {['admin', 'hrd'].indexOf(user.role) >= 0 && (
              <div className="flex self-stretch items-center justify-start px-2.5">
                <img src="/fimgs/550_6741.x1.svg" />
                <button
                  className="flex flex-1 space-x-1 items-center justify-start p-2.5"
                  onClick={() => (window as any).navigate('/admin/csr')}
                >
                  <div className="text-sm leading-tight text-white">CSR</div>
                </button>
              </div>
            )}
            {['admin', 'director'].indexOf(user.role) >= 0 && (
              <>
                {/* <div className="flex self-stretch items-center justify-start px-2.5">
                  <img src="/fimgs/548_4307.x1.svg" />
                  <button
                    className="flex flex-1 space-x-1 items-center justify-start p-2.5"
                    onClick={() =>
                      (window as any).navigate('/admin/summary-report')
                    }
                  >
                    <div className="text-sm leading-tight text-white">
                      Summary Report
                    </div>
                  </button>
                </div> */}

                <div className="summary-report-container flex flex-col">
                  <div className="flex self-stretch items-center justify-start px-2.5 relative">
                    <img
                      src="/fimgs/548_4307.x1.svg"
                      className="transform transition-transform duration-200 w-4"
                      css={css`
                        height: 16px;
                        &.rotate {
                          transform: rotate(180deg);
                        }
                      `}
                    />
                    <button
                      className="flex flex-1 space-x-1 items-center justify-start p-2.5"
                      onClick={(e) => {
                        const img =
                          e.currentTarget.parentElement?.querySelector(
                            '#dropdown-arrow'
                          )
                        const content = e.currentTarget
                          .closest('.summary-report-container')
                          ?.querySelector('.dropdown-content')

                        if (content) {
                          content.classList.toggle('h-0')
                          content.classList.toggle('opacity-0')
                          content.classList.toggle('py-0')
                          content.classList.toggle('my-0')
                        }
                        if (img) {
                          img.classList.toggle('rotate')
                        }
                      }}
                    >
                      <div className="text-sm leading-tight text-white">
                        Summary Report
                      </div>
                    </button>
                    {/* <img
                      id="dropdown-arrow"
                      src="/fimgs/down-arrow.svg"
                      className="transform transition-transform duration-200 w-4 text-2xl text-white stroke-white"
                      css={css`
                        height: 16px;
                        &.rotate {
                          transform: rotate(180deg);
                        }
                      `}
                    /> */}
                  </div>

                  <div className="dropdown-content transition-all duration-200 h-0 opacity-0 py-0 my-0 overflow-hidden">
                    <button
                      className="flex self-stretch items-center justify-start w-full py-2"
                      onClick={() =>
                        window.open(
                          'https://csr-mb.avianbrands.com/public/dashboard/91749948-25ae-4b33-81a4-b901fba000b1',
                          '_blank'
                        )
                      }
                    >
                      <div className="text-sm leading-tight text-white ml-11">
                        Produk
                      </div>
                    </button>
                    <button
                      className="flex self-stretch items-center justify-start w-full py-2"
                      onClick={() =>
                        window.open(
                          'https://csr-mb.avianbrands.com/public/dashboard/f2f0ae4a-12be-410d-8464-4b223c2ffdee',
                          '_blank'
                        )
                      }
                    >
                      <div className="text-sm leading-tight text-white ml-11">
                        Pilar CSR
                      </div>
                    </button>
                    <button
                      className="flex self-stretch items-center justify-start w-full py-2"
                      onClick={() =>
                        window.open(
                          'https://csr-mb.avianbrands.com/public/dashboard/541ed1a6-849e-4510-bc30-3864abe733f7',
                          '_blank'
                        )
                      }
                    >
                      <div className="text-sm leading-tight text-white ml-11">
                        Penerima
                      </div>
                    </button>
                    <button
                      className="flex self-stretch items-center justify-start w-full py-2"
                      onClick={() =>
                        window.open(
                          'https://csr-mb.avianbrands.com/public/dashboard/59a7c2b1-d29a-47d6-85b2-58f91c45b2e7',
                          '_blank'
                        )
                      }
                    >
                      <div className="text-sm leading-tight text-white ml-11">
                        Executive Summary
                      </div>
                    </button>
                  </div>
                </div>
              </>
            )}

            {['admin'].indexOf(user.role) >= 0 && (
              <div className="flex self-stretch items-center justify-start px-2.5">
                <img src="/fimgs/550_6380.x1.svg" />
                <button
                  className="flex flex-1 space-x-1 items-center justify-start p-2.5"
                  onClick={() =>
                    (window as any).navigate('/admin/setting-target')
                  }
                >
                  <div className="text-sm leading-tight text-white">
                    Setting Target
                  </div>
                </button>
              </div>
            )}

            {['admin', 'director'].indexOf(user.role) >= 0 && (
              <div className="flex self-stretch items-center justify-start px-2.5">
                <img src="/fimgs/676_4759.x1.svg" />
                <button
                  className="flex flex-1 space-x-1 items-center justify-start p-2.5"
                  onClick={() => (window as any).navigate('/admin/lacak-csr')}
                >
                  <div className="text-sm leading-tight text-white">Lacak</div>
                </button>
              </div>
            )}

            {['admin'].indexOf(user.role) >= 0 && (
              <div className="flex self-stretch items-center justify-start px-2.5">
                <img
                  src="/fimgs/user.x1.svg"
                  css={css`
                    height: 16px !important;
                  `}
                />
                <button
                  className="flex flex-1 space-x-1 items-center justify-start p-2.5"
                  onClick={() => (window as any).navigate('/admin/users')}
                >
                  <div className="text-sm leading-tight text-white">User</div>
                </button>
              </div>
            )}
            {['admin'].indexOf(user.role) >= 0 ? (
              <div className="flex flex-col">
                <div className="flex flex-1 flex-col">
                  <div className="flex self-stretch flex-col items-start justify-start">
                    <button className="flex self-stretch items-start justify-start">
                      <div className="flex flex-1 space-x-1 items-center justify-start p-2.5">
                        <div className="text-base font-light leading-normal text-gray-300">
                          MASTER DATA
                        </div>
                      </div>
                    </button>
                    <div className="flex self-stretch flex-col items-start justify-start transition-height duration-500 ease-in-out overflow-hidden">
                      <button
                        className="flex self-stretch flex-col items-center justify-start "
                        onClick={() =>
                          (window as any).navigate(
                            '/admin/master-data-kegiatan'
                          )
                        }
                      >
                        <div className="flex self-stretch items-center justify-start py-2.5">
                          <div className="text-sm leading-tight text-white ml-10">
                            Kegiatan CSR
                          </div>
                        </div>
                      </button>
                      <button
                        className="flex self-stretch flex-col items-center justify-start  "
                        onClick={() =>
                          (window as any).navigate(
                            '/admin/master-data-supplier'
                          )
                        }
                      >
                        <div className="flex self-stretch items-center justify-start py-2.5">
                          <div className="text-sm leading-tight text-white ml-10">
                            Supplier
                          </div>
                        </div>
                      </button>
                      <button
                        className="flex self-stretch flex-col items-center justify-start  "
                        onClick={() =>
                          (window as any).navigate('/admin/master-data-area')
                        }
                      >
                        <div className="flex self-stretch items-center justify-start py-2.5">
                          <div className="text-sm leading-tight text-white ml-10">
                            Area Tirta
                          </div>
                        </div>
                      </button>
                      <button
                        className="flex self-stretch flex-col items-center justify-start  "
                        onClick={() =>
                          (window as any).navigate('/admin/master-data-cabang')
                        }
                      >
                        <div className="flex self-stretch items-center justify-start py-2.5">
                          <div className="text-sm leading-tight text-white ml-10">
                            Cabang
                          </div>
                        </div>
                      </button>
                      <button
                        className="flex self-stretch flex-col items-center justify-start  "
                        onClick={() =>
                          (window as any).navigate(
                            '/admin/master-data-jenis-bantuan'
                          )
                        }
                      >
                        <div className="flex self-stretch items-center justify-start py-2.5">
                          <div className="text-sm leading-tight text-white ml-10">
                            Jenis Bantuan
                          </div>
                        </div>
                      </button>
                      <button
                        className="flex self-stretch flex-col items-center justify-start  "
                        onClick={() =>
                          (window as any).navigate(
                            '/admin/master-data-instansi-penerima'
                          )
                        }
                      >
                        <div className="flex self-stretch items-center justify-start py-2.5">
                          <div className="text-sm leading-tight text-white ml-10">
                            Instansi Penerima
                          </div>
                        </div>
                      </button>
                      <button
                        className="flex self-stretch flex-col items-center justify-start  "
                        onClick={() =>
                          (window as any).navigate(
                            '/admin/master-data-jenis-instansi'
                          )
                        }
                      >
                        <div className="flex self-stretch items-center justify-start py-2.5">
                          <div className="text-sm leading-tight text-white ml-10">
                            Jenis Instansi
                          </div>
                        </div>
                      </button>
                      <button
                        className="flex self-stretch flex-col items-center justify-start  "
                        onClick={() =>
                          (window as any).navigate(
                            '/admin/master-data-fasilitas'
                          )
                        }
                      >
                        <div className="flex self-stretch items-center justify-start py-2.5">
                          <div className="text-sm leading-tight text-white ml-10">
                            Fasilitas Lainnya
                          </div>
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-1"></div>
            )}

            <div className="flex self-stretch items-center justify-start px-2.5">
              <img
                src="/fimgs/key.x1.svg"
                css={css`
                  height: 16px !important;
                `}
              />
              <button className="flex flex-1 space-x-1 items-center justify-start p-2.5">
                <div
                  onClick={() =>
                    (window as any).navigate('/admin/change-password')
                  }
                  className="text-sm leading-tight text-white"
                >
                  Ubah Password
                </div>
              </button>
            </div>
            <div className="flex self-stretch items-center justify-start px-2.5">
              <img
                src="/fimgs/logout.x1.svg"
                css={css`
                  height: 16px !important;
                `}
              />
              <button
                className="flex flex-1 space-x-1 items-center justify-start p-2.5"
                onClick={() =>
                  api('/api/logout').then(
                    () => (window.location.href = '/login')
                  )
                }
              >
                <div className="text-sm leading-tight text-white">Keluar</div>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
})
