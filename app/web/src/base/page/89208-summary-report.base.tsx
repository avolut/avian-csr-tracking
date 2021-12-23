base(
  {
    meta: () => {
      const meta = {
        loading: true,
        reports: [] as any[],
        METABASE_SITE_URL: '',
        download(frame) {
          var canvas: any = document.getElementById('canvas'),
            context = canvas.getContext('2d')
          canvas.width = 500
          canvas.height = 600

          // Grab the iframe
          var inner = document.getElementById(frame)

          // Get the image
          globalVar.iframe2image(inner, function (err, img) {
            // If there is an error, log it
            if (err) {
              return console.error(err)
            }

            // Otherwise, add the image to the canvas
            context.drawImage(img, 0, 0)
          })
        },
      }
      return meta
    },
    init: ({ meta }) => {
      const _init = async () => {
        const config = await db.m_config.findFirst({
          where: {
            type: 'METABASE_SITE_URL',
          },
        })
        const metabases = await db.m_metabase.findMany({
          where: {
            type: 'summary-report',
          },
        })
        const _metabases: any[] = []
        await globalVar.asyncForEach(metabases, async (m) => {
          const credential = await api('/api/login-metabase', {
            resource: m.resource,
            params: {},
          })
          const iframeUrl =
            config.value +
            '/embed/dashboard/' +
            credential.token +
            '#bordered=true&titled=true'

          _metabases.push({ ...m, iframeUrl })
        })
        meta.reports = _metabases
        meta.loading = false
      }

      _init()
    },
  },
  ({ meta }) => (
    <div className="flex flex-1">
      {meta.loading ? (
        <loading />
      ) : (
        <pure-tab
          tabs={meta.reports
            .map((el: any, idx) => {
              return {
                title: el.title,
                component: () => (
                  <div key={idx} className="flex flex-col">
                    <button
                      className="bg-gray-600 border shadow rounded text-white font-semibold flex-end mr-5 my-2"
                      onClick={() => meta.download(el.title)}
                      style={`
                        width: 90px;
                        padding: 5px;
                        align-self: self-end;
                      `}
                    >
                      Download
                    </button>
                    <iframe id={el.title} className="w-full h-full" src={el.iframeUrl} sandbox="allow-scripts"/>
                    <canvas id="canvas" className="absolute"></canvas>
                  </div>
                ),
              }
            })
            .filter((e) => !!e.title)}
          position={'top'}
        />
      )}
    </div>
  )
)
