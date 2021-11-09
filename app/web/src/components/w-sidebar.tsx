/** @jsx jsx */
import { useLocalObservable } from 'mobx-react-lite'
import { useComponent } from 'web.utils/component'

export default ({ children }) => {
  const meta = useLocalObservable(() => ({
    expandMaster: false,
  }))
  const toggleMaster = (e) => {
    e.stopPropagation()
    e.preventDefault()
    const node = e.target.parentElement
    if (node.nodeName === 'BUTTON') {
      const content = node.nextElementSibling
      content.classList.toggle('h-0')
    }
    console.log(e)
  }

  const _component = useComponent(
    'w-sidebar',
    '/app/web/src/components/w-sidebar',
    {
      useLocalObservable,
      meta,
      toggleMaster,
    }
  )
  return eval(_component.render)
}
