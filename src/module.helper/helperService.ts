import { format } from 'date-fns'

export default class HelperService {
  public getFormattedDate(date: Date): string {
    if (typeof date === 'string') {
      date = new Date(date)
    }

    return format(date, 'yyyy-MM-dd HH:mm:ss')
  }

  public getExpirationDate(hours: number = 1) {
    const currentDate = new Date()
    currentDate.setHours(currentDate.getHours() + hours)

    return this.getFormattedDate(currentDate)
  }
}
