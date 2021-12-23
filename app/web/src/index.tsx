import { BaseHtml, platform, ssr, start, hostname } from 'web-init/src/start'

platform('web')
hostname(({ mode, port }) => {
  if (mode === 'dev') return `http://localhost:${port}`
  else return `http://e.plansys.co:3023`
})
export default ssr
export const html: BaseHtml = ({
  injectJS,
  injectCSS,
  timestamp,
  ssrChildren,
}) => {
  return (
    <html className="ios">
      <head>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="viewport-fit=cover, width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
        <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
        <title></title>
        {injectCSS}
        <link rel="stylesheet" href={`/index.css?${timestamp}`} />
      </head>
      <body>
        <div id="server-root">{ssrChildren}</div>
        <div id="client-root"></div>
        {injectJS}
      </body>
    </html>
  )
}
start(html)
