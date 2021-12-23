base(
  {
    meta: () => ({} as any),
    init: ({ meta }) => {
      const user = JSON.parse((window as any).user.get())
      const role = user.role
      const pathname = window.location.pathname

      if (role === 'guest' && pathname !== '/login') {
        return (window.location.href = '/login')
      } else if (role !== 'guest' && pathname === '/login') {
        return (window.location.href = '/')
      } else if (role !== 'guest' && pathname !== '/') {
        const roles = {
          hrd: ['/admin/dashboard', '/admin/csr', '/changePassword'],
          director: [
            '/admin/dashboard',
            '/admin/summary-report',
            'admin/lacak-csr',
            '/changePassword',
          ],
        }

        if (role === 'hrd') {
          if (roles.hrd.findIndex((x) => pathname.match(x)) < 0)
            return (window.location.href = '/')
        }

        if (role === 'director') {
          if (roles.director.findIndex((x) => pathname.match(x)) < 0)
            return (window.location.href = '/')
        }
      }
    },
  },
  ({ meta, children }) => (
    <>
      <>
        <div className={`bg-white flex flex-1 overflow-hidden`}>{children}</div>
      </>
    </>
  )
)
