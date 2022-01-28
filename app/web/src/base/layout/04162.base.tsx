base(
  {
    meta: () =>
      ({
        titleHeader: '-',
        open: false,
        user: {},
        getTitleHeader() {
          const titleHeader = {
            '/admin/dashboard': 'Dashboard',
            '/admin/csr': 'CSR',
            '/admin/summary-report': 'Summary Report',
            '/admin/setting-target': 'Setting Target',
            '/admin/lacak-csr': 'Lacak CSR',
            '/admin/master-data-kegiatan': 'Kegiatan CSR',
            '/admin/master-data-supplier': 'Supplier',
            '/admin/master-data-area': 'Area Tirta',
            '/admin/master-data-cabang': 'Cabang',
            '/admin/master-data-covered-area': 'Covered Area',
            '/admin/master-data-jenis-instansi': 'Jenis Instansi',
            '/admin/master-data-fasilitas': 'Fasilitas Penerima Bantuan',
            '/admin/master-data-jenis-bantuan': 'Jenis Bantuan',
            '/admin/master-data-instansi-penerima': 'Instansi Penerima',
            '/admin/master-data-jenis-instanis': 'Jenis Instansi',
            '/admin/change-password': 'Ubah Password',
            '/admin/users': 'Manajemen Pengguna',
            '/admin/pdf': 'Download CSR',
          }

          const f = Object.keys(titleHeader).find((x) =>
            window.location.pathname.match(x)
          ) as any

          return titleHeader[f] || '-'
        },
      } as any),
    init: async ({ meta }) => {
      const user = JSON.parse((window as any).user.get())
      const role = user.role
      const pathname = window.location.pathname

      if (role === 'guest' && pathname !== '/login') {
        return (window.location.href = '/login')
      } else if (role !== 'guest' && pathname === '/login') {
        return (window.location.href = '/')
      } else if (role !== 'guest') {
        const roles = {
          hrd: ['/admin/csr', '/admin/change-password', '/admin/pdf'],
          director: [
            '/admin/summary-report',
            '/admin/lacak-csr',
            '/admin/change-password',
          ],
        }
        if (role === 'hrd') {
          if (roles.hrd.findIndex((x) => pathname.match(x)) < 0)
            return (window.location.href = roles.hrd[0])
        }

        if (role === 'director') {
          if (roles.director.findIndex((x) => pathname.match(x)) < 0)
            return (window.location.href = roles.director[0])
        }
      }

      meta.open = false
      meta.user = user
    },
  },
  ({ meta, children }) => (
    <div className={`bg-white flex flex-1`}>
      <div
        className={`${
          meta.open ? 'flex' : 'hidden'
        } lg:flex fixed h-screen z-50 show-me`}
        style="width: 250px"
      >
        <w-sidebar user={meta.user} />
      </div>
      <div
        className="h-screen z-40 flex flex-1 self-stretch flex-col items-start justify-start bg-white"
        style={css`
          @media only screen and (min-width: 1024px) {
            & {
              padding-left: 250px;
            }
          }
        `}
      >
        <div className={`flex self-stretch flex-col items-start justify-start`}>
          <w-topbar
            title={meta.getTitleHeader()}
            open={meta.open}
            onClickOpen={() => {
              runInAction(() => {
                meta.open = !meta.open
              })
            }}
          />
        </div>
        <div
          className="flex-1 flex self-stretch relative"
          style={css`
            > div {
              flex: 1;
            }
          `}
        >
          {children}
        </div>
      </div>
    </div>
  )
)
