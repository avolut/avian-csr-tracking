base(
  {
    meta: () => {
      const meta = {
        username: '',
        password: '',
        action: {} as any,
        isMobile: window.innerWidth <= 768,
      }
      return meta
    },
    init: ({ meta }) => {
      meta.action = {
        onChange: action((e, field) => {
          meta[field] = e.target.value
        }),
        login: async () => {
          const res = await api('/api/login', {
            username: meta.username,
            password: meta.password,
            role: 'admin',
          })

          if (res.status === 'success') {
            localStorage.setItem('user', JSON.stringify(res.user))
            const roles = {
              hrd: '/admin/csr',
              director: '/admin/summary-report',
            }

            if (res.user.role === 'hrd') {
              return (window.location.href = roles.hrd)
            }

            if (res.user.role === 'director') {
              return (window.location.href = roles.director)
            }

            return (window.location.href = '/admin/dashboard')
          } else {
            alert(res.msg || res.error)
          }
        },
      }
      const handleWindowSizeChange = action(
        () => (meta.isMobile = window.innerWidth <= 768)
      )
      window.addEventListener('resize', handleWindowSizeChange)
      return () => {
        window.removeEventListener('resize', handleWindowSizeChange)
      }
    },
  },
  ({ meta }) => (
    <>
      {meta.isMobile ? (
        <div
          className="flex flex-1 h-screen items-center"
          style={css`
            background: url('/fimgs/472_4252.x1.png');
          `}
        >
          <div
            className="block flex-1 m-4 p-4"
            style={css`
              background: rgba(255, 255, 255, 0.7);
              height: 300px;
            `}
          >
            <div
              className={`flex self-stretch flex-col items-center justify-center`}
            >
              <div className="text-xs">WELCOME TO</div>
              <div className="font-bold text-2xl text-green-800">CSR TRACKING</div>
            </div>
            <form
              className={`flex flex-col items-center justify-center`}
              onSubmit={(e) => {
                e.preventDefault()
                meta.action.login()
              }}
            >
              <div
                className={`flex flex-col gap-4 self-stretch items-end justify-start mt-5 p-2.5`}
              >
                <input
                  type={'text'}
                  className={`bg-white`}
                  placeholder="Username"
                  value={meta.username}
                  onChange={(e) => meta.action.onChange(e, 'username')}
                  style={css`
                    width: 100%;
                    border: 1px solid #cececb !important;
                    background: white !important;
                    border-radius: 15px !important;
                    padding: 5px !important;
                    color: #727272 !important;
                  `}
                />
                <input
                  className={`flex flex-col space-y-2.5 items-start justify-start w-full border-b`}
                  type="password"
                  placeholder="Password"
                  type="password"
                  value={meta.password}
                  onChange={(e) => meta.action.onChange(e, 'password')}
                  style={css`
                    width: 100%;
                    border: 1px solid #cececb !important;
                    background: white !important;
                    border-radius: 15px !important;
                    padding: 5px !important;
                    color: #727272 !important;
                  `}
                />
              </div>
              <div
                className={`flex self-stretch flex-col items-center justify-end px-2.5 pt-5 pb-2.5`}
              >
                <btn
                  className={`flex items-center justify-center px-4 py-2 bg-green-600 rounded w-full text-white rounded-full`}
                  type={'submit'}
                >
                  Masuk
                </btn>
              </div>
            </form>
          </div>
        </div>
      ) : (
        <div className={`flex flex-1 self-stretch items-start justify-start`}>
          <img
            src="/fimgs/472_4252.x1.png"
            className="flex flex-1 self-stretch items-center justify-center bg-green-50"
            style={css`
              width: 50vw;
              height: 100vh;
            `}
          />
          <div className={`flex flex-1 self-stretch items-start justify-start`}>
            <div
              className={`flex flex-1 self-stretch flex-col space-y-2.5 items-center justify-center pt-24`}
            >
              <div
                className={`flex self-stretch flex-col items-center justify-center`}
              >
                <div className="text-xs">WELCOME TO</div>
                <div className="font-bold text-2xl text-green-800">
                  CSR TRACKING
                </div>
              </div>
              <form
                className={`flex flex-col items-center justify-center`}
                style={css`
                  width: 465px;
                  height: 261px;
                `}
                onSubmit={(e) => {
                  e.preventDefault()
                  meta.action.login()
                }}
              >
                <div className={`flex self-stretch items-end justify-start p-2.5`}>
                  <inp-text
                    className={`flex flex-col space-y-2.5 items-start justify-start w-full border-b`}
                    label="Username"
                    placeholder="Username"
                    value={meta.username}
                    onChange={(e) => meta.action.onChange(e, 'username')}
                  />
                </div>
                <div className={`flex self-stretch items-end justify-start p-2.5`}>
                  <inp-text
                    className={`flex flex-col space-y-2.5 items-start justify-start w-full border-b`}
                    label="Password"
                    placeholder="Password"
                    type="password"
                    value={meta.password}
                    onChange={(e) => meta.action.onChange(e, 'password')}
                  />
                </div>
                <div
                  className={`flex self-stretch flex-col items-center justify-end px-2.5 pt-5 pb-2.5`}
                >
                  <btn
                    className={`flex items-center justify-center px-4 py-2 bg-green-600 rounded w-full text-white`}
                    type={'submit'}
                  >
                    Masuk
                  </btn>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  )
)
