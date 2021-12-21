base(
  {
    meta: {
      loading: true,
      iframeUrl: '',
      METABASE_SITE_URL: '',
    },
    init: ({ meta }) => {
      const _init = async () => {
        const config = await db.m_config.findFirst({
          where: {
            type: 'METABASE_SITE_URL',
          },
        })

        const metabase = await db.m_metabase.findFirst({
          where: {
            type: 'dashboard',
          },
        })

        const credential = await api('/api/login-metabase', {
          resource: metabase.resource,
          params: {},
        })
        meta.iframeUrl =
          config.value +
          '/embed/dashboard/' +
          credential.token +
          '#bordered=true&titled=true'
        meta.loading = false
      }

      _init()
    },
  },
  ({ meta }) => (
    <div className="flex flex-1">
      <iframe className="w-full" src={meta.iframeUrl} />
    </div>
  )
)
