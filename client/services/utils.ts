import { format } from 'date-fns'

export const formattedDate = (date: Date) => {
  return format(new Date(date), 'yyyy-MM-dd HH:mm:ss')
}
