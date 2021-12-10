base(
  {
    meta: {
      userLoggedIn: (window as any).user,
      isAdmin: function () {
        if (this.userLoggedIn.role !== 'admin') {
          window.location.href = '/'
        }
      },
    },
    init: ({ meta }) => {
      meta.isAdmin()
    },
  },
  ({ meta }) => <pdf-reader csrId={+params.csrId}/>
)
