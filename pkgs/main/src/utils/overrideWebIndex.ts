import { dirs } from 'boot'
import { readFile } from 'libs/fs'
import { join } from 'path'
// import { publicBundle } from 'src/bundler/public/public'
export const overrideWebIndex = async (mode) => {
  return
  let index = await readFile(
    join(dirs.app.web, 'public', 'index.html'),
    'utf-8'
  )
  // const workbox = `
  // <script src="https://unpkg.com/workbox-window@6.1.5/build/workbox-window.prod.umd.js"></script>
  // <script type="module">
  // if ('serviceWorker' in navigator) {
  //   if (workbox && workbox.Workbox) {
  //     // const wb = new workbox.Workbox('/sw.js');
  //     // wb.addEventListener('waiting', function (ev) {
  //     //   window.updateApp = function () {
  //     //     wb.addEventListener('controlling', (event) => {
  //     //       window.location.reload();
  //     //     });
  //     //     wb.messageSkipWaiting();
  //     //   }
  //     //   setTimeout(function () {
  //     //     if (window.showUpdateApp) {
  //     //       window.showUpdateApp();
  //     //     }
  //     //   },1000)
  //     // });
  //     // wb.register();
  //   }
  // }
  // </script>`

  index = index.replace(
    '</head>',
    `
<script>window.process = {env: {NODE_ENV: "development",MODE: "development"}};</script>
<script>
  window.imported = {};
  window.require = (path) => {
    if (window.imported[path]) {
      return window.imported[path];
    }
    return {};
  }
</script>
</head>`
  )

  if (mode === 'prod') {
    index = index.replace(/development/gi, 'production')
  }

  const indexBuffer = Buffer.from(index)
  // await publicBundle.db.save(
  //   'public',
  //   'app/web/build/web/index.html',
  //   indexBuffer
  // )
  // publicBundle.db.compressSingle(
  //   'public',
  //   'app/web/build/web/index.html',
  //   indexBuffer
  // )

  let fwPath = join(
    dirs.pkgs.web,
    'init',
    'node_modules',
    'framework7',
    'framework7-bundle.min.css'
  )

  const f7 = await readFile(fwPath)
  // publicBundle.db.items.raw.public.put('app/web/build/web/f7.css', f7)
  // publicBundle.db.compressSingle('public', 'app/web/build/web/f7.css', f7)
}
