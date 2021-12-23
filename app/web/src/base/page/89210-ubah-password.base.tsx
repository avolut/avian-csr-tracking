base(
  {
    meta: () => {
      const meta = {
        saving: false,
        error: '',
        success: false,
        userLoggedIn: JSON.parse((window as any).user.get()),
        form: {
          password: '',
          passwordConfirm: '',
        },
        onChange: function (e) {
          this.success = false;
          const { name, value } = e.target
          this.form = { ...this.form, [name]: value }
          this.error = ''

          if (
            this.form.passwordConfirm.length >= this.form.password.length &&
            this.form.password !== this.form.passwordConfirm
          ) {
            this.error = 'Password Tidak Sama.'
          }
        },
        handleSubmit: function () {
          if (this.saving) return;
          
          if (this.error || !this.form.password) return

          if (this.form.password !== this.form.passwordConfirm) {
            this.error = 'Password Tidak Sama.'
            return
          }

          this.saving = true

          api('/api/update-password', {
            id: this.userLoggedIn.id,
            password: this.form.password,
          })
            .then((res) => {
              if (res.status === 'success') {
                this.success = true
              }
            })
            .finally(() => {
              this.saving = false
            })
        },
      }
      return meta
    },
    init: ({ meta }) => {},
  },
  ({ meta }) => (
    <div className="mx-12 pt-16">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col flex-1">
          <label className="text-sm text-gray-700" htmlFor="password">
            Password Baru
          </label>
          <input
            className="border-b outline-none focus:border-gray-400"
            type="password"
            id="password"
            name="password"
            onChange={meta.onChange}
            style={`
            padding: 10px 0 !important;
            border-bottom: 1px solid rgb(229 231 235/var(--tw-border-opacity)) !important;
        `}
          />
        </div>
        <div className="flex flex-col flex-1">
          <label className="text-sm text-gray-700" htmlFor="passwordConfirm">
            Ulangi Password
          </label>
          <input
            className="border-b outline-none focus:border-gray-400"
            type="password"
            id="passwordConfirm"
            name="passwordConfirm"
            onChange={meta.onChange}
            disabled={!meta.form.password}
            style={`
            padding: 10px 0 !important;
            border-bottom: 1px solid rgb(229 231 235/var(--tw-border-opacity)) !important;
        `}
          />
        </div>
      </div>
      <div className="text-red-700 mt-4">{meta.error}</div>
      {meta.success && (
        <div className="text-green-700 mt-4">Password berhasil di ubah</div>
      )}
      <button
        className={`mt-6 text-sm bg-green-700 text-white p-2 rounded ${
          meta.saving ? 'opacity-50' : ''
        }`}
        onClick={meta.handleSubmit}
      >
        {meta.saving ? 'Meyimpan...' : 'Ubah Password'}
      </button>
    </div>
  )
)
