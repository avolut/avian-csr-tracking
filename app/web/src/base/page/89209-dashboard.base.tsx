base(
  {
    meta: () => {
      const meta = {
        loading: true,
        iframeUrl: '',
        METABASE_SITE_URL: '',
        download() {
          var canvas: any = document.getElementById('canvas'),
            context = canvas.getContext('2d')
          canvas.width = 500
          canvas.height = 600

          // Grab the iframe
          var inner = document.getElementById('download-iframe')

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
    <div className="flex flex-1 flex-col">
      {/* <button
        className="bg-gray-600 border shadow rounded text-white font-semibold flex-end mr-5 mb-2"
        onClick={() => meta.download()}
        style={`width: 90px;padding: 5px;align-self: self-end;`}
      >
        Download
      </button> */}
      <iframe
        id="download-iframe"
        className="w-full h-full"
        src={meta.iframeUrl}
        sandbox="allow-forms allow-downloads allow-scripts allow-same-origin allow-popups"
      />
      <canvas id="canvas" className="absolute"></canvas>
    </div>
  )
)
