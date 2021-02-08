import schedule, { Job } from 'node-schedule'
import Koa from 'koa'
import AuthController from 'src/controllers/auth'
import { DataBase } from 'src/db'
import { format } from 'date-fns'

export interface SchedulerServiceConfig {}

export default function schedulerService(app: Koa, authController: AuthController) {
  const DB: DataBase = app.context.db

  let expiredActivationLinksObserver: Job | undefined

  function startObservingExpiredActivationLinks() {
    expiredActivationLinksObserver = schedule.scheduleJob('* */1 * * *', async () => {
      let date = new Date()
      date.setHours(date.getHours() - 1)

      let updateDate = format(date, 'yyyy-MM-dd HH:mm:ss')

      authController.removeExpiredActivationLinks(updateDate, DB)
    })
  }

  function start() {
    startObservingExpiredActivationLinks()
  }

  return {
    start
  }
}

export type SchedulerService = ReturnType<typeof schedulerService>
