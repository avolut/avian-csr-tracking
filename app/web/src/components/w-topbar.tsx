/** @jsx jsx */
import { jsx } from '@emotion/react'
import { useComponent } from 'web.utils/component'

export default ({ children, title, open, onClickOpen }) => {
  const date = new Date()

  const formatDate = (dateString) => {
    let date = new Date(dateString),
      day = date.getDate(),
      month = date.getMonth(),
      year = date.getFullYear(),
      months = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
      ]
    return String(day).padStart(2, '0') + ' ' + months[month] + ' ' + year
  }

  const _component = useComponent(
    'w-topbar',
    '/app/web/src/components/w-topbar',
    { date, formatDate, title, open, onClickOpen }
  )
  return eval(_component.render)
}
