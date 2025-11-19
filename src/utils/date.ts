import dayjs from 'dayjs'

export const formatDate = (date: string | Date, format: string = 'YYYY-MM-DD'): string => {
  return dayjs(date).format(format)
}

export const formatDateTime = (date: string | Date): string => {
  return dayjs(date).format('YYYY-MM-DD HH:mm:ss')
}

export const formatMonth = (date: string | Date): string => {
  return dayjs(date).format('YYYY-MM')
}

export const formatTime = (date: string | Date): string => {
  return dayjs(date).format('HH:mm')
}

export const isToday = (date: string | Date): boolean => {
  return dayjs(date).isSame(dayjs(), 'day')
}

export const isYesterday = (date: string | Date): boolean => {
  return dayjs(date).isSame(dayjs().subtract(1, 'day'), 'day')
}

export const getDateDisplay = (date: string | Date): string => {
  if (isToday(date)) return '今天'
  if (isYesterday(date)) return '昨天'
  return formatDate(date, 'MM月DD日')
}

export const getMonthRange = (date: string | Date = new Date()) => {
  const start = dayjs(date).startOf('month').format('YYYY-MM-DD')
  const end = dayjs(date).endOf('month').format('YYYY-MM-DD')
  return { start, end }
}

export const getYearRange = (date: string | Date = new Date()) => {
  const start = dayjs(date).startOf('year').format('YYYY-MM-DD')
  const end = dayjs(date).endOf('year').format('YYYY-MM-DD')
  return { start, end }
}
