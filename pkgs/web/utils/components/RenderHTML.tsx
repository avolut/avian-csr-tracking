/** @jsx jsx */
import { css, jsx } from '@emotion/react'

export default ({ children }) => {
  return (
    <div
      css={css`
        p {
          margin: 15px 0px;
        }
        ul,
        ol {
          margin: 0px;
          padding-left: 15px !important;
          li {
            margin: 5px 0px;
            list-style-type: disc;
          }
        }

        ol li {
          list-style-type: decimal;
        }

        a {
          color: #135db1;
          text-decoration: underline;
        }
      `}
      dangerouslySetInnerHTML={{ __html: children }}
    ></div>
  )
}
