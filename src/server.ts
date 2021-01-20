import Koa, { Context } from 'koa'
import bodyParser from 'koa-bodyparser'
import cors from 'koa2-cors'
import logger from 'koa-logger'

import DB from './db'
import { IConfig } from './config'
import authRoutes from './routes/authRoutes'
import AuthController from './controllers/auth'
import Router from 'koa-router'
import EmailService from './module.email/emailService'
import ErrorService from './module.error/errorService'
import HelperService from './module.helper/helperService'

const startServer = (config: IConfig) => {
  // Core
  const core = (() => {
    const app: Koa = new Koa()
    const router = new Router()

    DB.instance
    app.context.db = DB

    app.use(bodyParser())
    app.use(cors({ origin: 'http://localhost:3000', credentials: true }))
    app.use(logger())

    app.use(router.routes())

    app
      .listen(config.port, async () => {
        console.log(`Server listening on port: ${config.port}`)
      })
      .on('error', err => {
        console.error(err)
      })

    return {
      app
    }
  })()

  // Services
  const services = (() => {
    const emailService = new EmailService(config)
    const errorService = new ErrorService()
    const helperService = new HelperService()

    return {
      emailService,
      errorService,
      helperService
    }
  })()

  // Controllers
  const controllers = (() => {
    const authController = new AuthController(
      services.emailService,
      services.errorService,
      services.helperService,
      config
    )

    return {
      authController
    }
  })()

  // Routes
  const routes = (() => {
    const auth = authRoutes(core.app, controllers.authController, services.helperService)
    return {
      auth
    }
  })()
}

export default startServer
