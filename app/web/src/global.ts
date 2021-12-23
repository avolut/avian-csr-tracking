import { format as formatFNS, parseISO } from 'date-fns'
import * as locales from 'date-fns/locale'
import { iframe2image } from './iframe2image'

const asyncForEach = async (
  array: Array<any>,
  callback: (a: any, b: number, c: Array<any>) => any
) => {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array)
  }
}

const formatDate = (value: any, format?: string, locale: string = 'id') => {
  const inputFormat = format ? format : 'dd MMM yyyy'
  try {
    if (typeof value === 'string') {
      return formatFNS(parseISO(value), inputFormat, {
        locale: (locales as any)[locale],
      })
    } else {
      return formatFNS(value, inputFormat, {
        locale: (locales as any)[locale],
      })
    }
  } catch (e) {
    return ''
  }
}

const currencyFormat = (number: number) =>
  new Intl.NumberFormat('id').format(number)

const numberFormat = (number: number) =>
  new Intl.NumberFormat('en-IN', {
    maximumSignificantDigits: 3,
  }).format(number)


export const globalVar = {
  asyncForEach,
  formatDate,
  currencyFormat,
  numberFormat,
  iframe2image
}
