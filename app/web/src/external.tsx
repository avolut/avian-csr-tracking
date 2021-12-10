// make sure to export default component not export const
export default {
  'render-html': () => [import('web-utils/components/RenderHTML')],
  'html-head': () => [import('web-utils/components/HtmlHead')],
  'hello-world': () => [import('web-utils/components/HelloWorld')],
  loading: () => [import('web-crud/src/legacy/Loading')],
  admin: () => [import('web-crud/src/CRUD')],
  qform: () => [import('web-crud/src/form/BaseForm')],
  qlist: () => [import('web-crud/src/list/QBaseList')],
  'w-sidebar': () => [import('./components/w-sidebar')],
  'w-topbar': () => [import('./components/w-topbar')],
  'inp-text': () => [import('./components/inp-text')],
  btn: () => [import('./components/btn')],
  'pure-tab': () => [import('web-crud/src/form/web/WFormTab')],
  'pdf-reader': () => [import('./components/pdf-reader')],
}
