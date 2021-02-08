import schedule, { Job } from 'node-schedule'
import Koa from 'koa'
import AuthController from 'src/controllers/auth'
import { DataBase } from 'src/db'

export interface SchedulerServiceConfig {}

export default function schedulerService(app: Koa, authController: AuthController) {
  const DB: DataBase = app.context.db

  let expiredActivationLinksObserver: Job | undefined

  function startObservingExpiredActivationLinks() {
    // start every hour
    let date = new Date()
    date.setHours(date.getHours() - 1)

    expiredActivationLinksObserver = schedule.scheduleJob('* * */1 * * *', async () => {
      authController.removeExpiredActivationLinks(date, DB)
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
