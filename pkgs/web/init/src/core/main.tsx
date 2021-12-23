/** @jsx jsx  */
import { jsx } from '@emotion/react'
import { useWindow } from 'libs'
import { Suspense, Component } from 'react'
import { useRender } from 'web-utils/src/useRender'
import Loading from 'web/crud/src/legacy/Loading'
import { Layout } from './layout/layout'
import { Page } from './page/page'

export const Main = () => {
  const { window } = useWindow()
  const render = useRender()

  if (!window.app) {
    window.app = {} as any
  }
  window.app.render = render

  return (
    <Layout>
      <PageError>
        <Suspense fallback={<Loading />}>
          <Page />
        </Suspense>
      </PageError>
    </Layout>
  )
}

class PageError extends Component<any, any> {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  componentDidCatch(error, info) {
    this.setState({ hasError: true })
  }

  render() {
    if (this.state.hasError) {
      return null
    }
    return this.props.children
  }
}
