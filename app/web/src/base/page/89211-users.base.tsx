base(
  {
    meta: {},
    init: ({ meta }) => {},
  },
  ({ meta }) => (
    <admin
      nav={['m_user']}
      content={{
        m_user: {
          table: 'm_user',
          label: 'Manajemen Pengguna',
          list: {
            action: {
              create: 'Tambah',
            },
            table: {
              columns: [
                ['name', { width: 500, title: 'Nama' }],
                ['username', { width: 500, title: 'Username' }],
                ['role', { width: 500, title: 'Role' }],
              ],
            },
            // params: {
            //   select: {
            //     "*": true,
            //   },
            //   order: [{ column: "id", order: "asc" }],
            // },
            // params:{},
          },
          form: {
            alter: {
              password: {
                type: 'password',
                title: 'Password',
                required: true,
                undoValue: 's',
              },
              role: {
                type: 'select',
                title: 'Role',
                items: [
                  {
                    value: 'director',
                    label: 'Director',
                  },
                  {
                    value: 'hrd',
                    label: 'HRD',
                  },
                  {
                    value: 'admin',
                    label: 'Admin',
                  },
                ],
              },
            },
            onSave: ({ data, save }) => {
              let method = 'update'
              if (!data.id) {
                method = 'create'
                data.last_login = new Date()
              }

              if (!data.password) return

              api('/api/update-password', {
                id: data.id,
                password: data.password,
                method,
                data,
              }).then((res) => {
                if (res.status === 'success') {
                  window.location.href = '/admin/users'
                }
              })
            },
            action: () => ({
              save: 'Simpan',
              jsonEdit: false,
            }),
            layout: [['name'], ['username'], ['role'], ['password']],
          },
        },
      }}
    />
  )
)
