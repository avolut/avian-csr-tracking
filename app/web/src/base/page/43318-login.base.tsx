base(
  {
    meta: {
      username: '',
      password: '',
      action: {},
    },
    init: async ({ meta }) => {
      runInAction(() => {
        meta.action = {
          onChange: (e, field) => {
            runInAction(() => {
              meta[field] = e.target.value
            })
          },
          login: async () => {
            // await api("/api/update-password", { id: 1, password: "12345" });
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

              return (window.location.href = '/')
            } else {
              alert(res.msg || res.error)
            }
          },
        }
      })
    },
  },
  ({ meta }) => (
    <>
      <>
        <div class={`flex flex-1 self-stretch items-start justify-start`}>
          <img
            src="/fimgs/472_4252.x1.png"
            class="flex flex-1 self-stretch items-center justify-center bg-green-50"
            style={css`
              width: 50vw;
              height: 100vh;
            `}
          />
          <div class={`flex flex-1 self-stretch items-start justify-start`}>
            <div
              class={`flex flex-1 self-stretch flex-col space-y-2.5 items-center justify-center pt-24`}
            >
              <div
                class={`flex self-stretch flex-col items-center justify-center`}
              >
                <div class="text-xs">WELCOME TO</div>
                <div class="font-bold text-2xl text-green-800">
                  CSR TRACKING
                </div>
              </div>
              <form
                class={`flex flex-col items-center justify-center`}
                style={css`
                  width: 465px;
                  height: 261px;
                `}
                onSubmit={(e) => {
                  e.preventDefault()
                  meta.action.login()
                }}
              >
                <div class={`flex self-stretch items-end justify-start p-2.5`}>
                  <inp-text
                    class={`flex flex-col space-y-2.5 items-start justify-start w-full border-b`}
                    label="Username"
                    placeholder="Username"
                    value={meta.username}
                    onChange={(e) => meta.action.onChange(e, 'username')}
                  />
                </div>
                <div class={`flex self-stretch items-end justify-start p-2.5`}>
                  <inp-text
                    class={`flex flex-col space-y-2.5 items-start justify-start w-full border-b`}
                    label="Password"
                    placeholder="Password"
                    type="password"
                    value={meta.password}
                    onChange={(e) => meta.action.onChange(e, 'password')}
                  />
                </div>
                <div
                  class={`flex self-stretch flex-col items-center justify-end px-2.5 pt-5 pb-2.5`}
                >
                  <btn
                    class={`flex items-center justify-center px-4 py-2 bg-green-600 rounded w-full text-white`}
                    type={'submit'}
                  >
                    Masuk
                  </btn>
                </div>
              </form>
            </div>
          </div>
        </div>
      </>
    </>
  )
)
