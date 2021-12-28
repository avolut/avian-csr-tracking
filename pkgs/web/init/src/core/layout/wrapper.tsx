/** @jsx jsx */
import { jsx } from '@emotion/react'
import { useWindow } from 'libs'
import { FC, Fragment } from 'react'
import MobileWrapper from './wrapper-mobile'
export const Wrapper: FC = ({ children }) => {
  const { window } = useWindow()
  const Layout = window.platform === 'mobile' ? MobileLayout : WebLayout

  return <Layout>{children}</Layout>
}

const MobileLayout: FC = ({ children }) => {
  return <MobileWrapper>{children}</MobileWrapper>
}

const WebLayout: FC = ({ children }) => {
  return <Fragment>{children}</Fragment>
}
