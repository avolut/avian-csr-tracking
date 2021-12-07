base(
  {
    meta: {
      error: '',
      success: false,
      userLoggedIn: (window as any).user,
      form: {
        password: '',
        passwordConfirm: '',
      },
      onChange: function (e) {
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
        if (this.error || !this.form.password) return
        if (
          this.form.password !== this.form.passwordConfirm
        ) {
          this.error = 'Password Tidak Sama.'
          return;
        }
        api('/api/update-password', {
          id: this.userLoggedIn.id,
          password: this.form.password,
        }).then((res) => {
          if (res.status === 'success') {
            this.success = true
          }
        })
      },
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
          />
        </div>
      </div>
      <div className="text-red-700 mt-4">{meta.error}</div>
      {meta.success && (
        <div className="text-green-700 mt-4">Password berhasil di ubah</div>
      )}
      <button
        className="mt-6 text-sm bg-green-700 text-white p-2 rounded"
        onClick={meta.handleSubmit}
      >
        Ubah Password
      </button>
    </div>
  )
)
