import { MBelongsTo } from './MBelongsTo'
import { MCustomPopup } from './MCustomPopup'
import { MDate } from './MDate'
import { MFile } from './MFile'
import { MInfo } from './Minfo'
import { MSection } from './MSection'
import { MSelect } from './MSelect'
import { MText } from './MText'
import { MUnknown } from './MUnknown'

export default {
  unknown: MUnknown,
  info: MInfo,
  section: MSection,
  money: MText,
  text: MText,
  number: MText,
  password: MText,
  multiline: MText,
  string: MText,
  select: MSelect,
  'custom-popup': MCustomPopup,
  date: MDate,
  file: MFile,
  'belongs-to': MBelongsTo,
}
