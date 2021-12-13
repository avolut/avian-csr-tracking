base(
  {
    meta: {
      userLoggedIn: (window as any).user as any,
      titleHeader: '-',
      open: false,
      render: null
    } as any,
    init: ({ meta }) => {
      if (
        meta.userLoggedIn.role === 'guest' &&
        window.location.pathname !== '/login'
      ) {
        return (window.location.href = '/login')
      } else if (
        meta.userLoggedIn.role !== 'guest' &&
        window.location.pathname === '/login'
      ) {
        return (window.location.href = '/')
      } else if (meta.userLoggedIn.role !== 'guest') {
        const roles = {
          hrd: ['/admin/csr', '/admin/change-password', '/admin/pdf'],
          director: ['/admin/summary-report', '/admin/change-password'],
        }
        if (meta.userLoggedIn.role === 'hrd') {
          if (roles.hrd.findIndex((x) => window.location.pathname.match(x)) < 0)
            return (window.location.href = roles.hrd[0])
        }

        if (meta.userLoggedIn.role === 'director') {
          if (
            roles.director.findIndex((x) => window.location.pathname.match(x)) <
            0
          )
            return (window.location.href = roles.director[0])
        }
      }

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
        '/admin/master-data-jenis-bantuan': 'Jenis Bantuan',
        '/admin/master-data-instansi-penerima': 'Instansi Penerima',
        '/admin/master-data-jenis-instanis': 'Jenis Instansi',
        '/admin/change-password': 'Ubah Password',
        '/admin/users': 'Manajemen Pengguna',
        '/admin/pdf': 'Download CSR',
      }

      runInAction(() => {
        meta.open = false;
        const f = Object.keys(titleHeader).find(
          (x) => window.location.pathname.match(x)
        ) as any
        meta.titleHeader = titleHeader[f] || '-'
        meta.render = Date.now()
      })
    },
  },
  ({ meta, children }) => (
    <div class={`bg-white flex flex-1`}>
      <div
        className={`${
          meta.open ? 'flex' : 'hidden'
        } lg:flex fixed h-screen z-50 show-me`}
        style="width: 250px"
      >
        <w-sidebar role={meta.userLoggedIn.role} />
      </div>
      <div
        class="h-screen z-40 flex flex-1 self-stretch flex-col items-start justify-start bg-white"
        style={css`
        @media only screen and (min-width: 1024px) {
          & {
             padding-left: 250px
          }
        }
        `}
      >
        <div class={`flex self-stretch flex-col items-start justify-start`}>
          <w-topbar
            title={meta.titleHeader}
            open={meta.open}
            onClickOpen={() => {
              runInAction(() => {
                meta.open = !meta.open
              })
            }}
          />
        </div>
        <div
          class="flex-1 flex items-stretch self-stretch relative"
          style={css`> div { flex:1 }`}
        >
          {children}
        </div>
      </div>
    </div>
  )
)

// ga geeremet2 wkwkw
