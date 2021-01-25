import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
import cors from 'koa2-cors'
import logger from 'koa-logger'
import { koaSwagger } from 'koa2-swagger-ui'

import DB from './db'
import { IConfig } from './config'
import AuthController from './controllers/auth'
import Router from 'koa-router'
import EmailService from './module.email/emailService'
import ErrorService from './module.error/errorService'
import HelperService from './module.helper/helperService'
import ProfileController from './controllers/profile'
import profileRoutes from './routes/profile'
import authRoutes from './routes/auth'
import swagger from './swagger'

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

    app.use(
      koaSwagger({
        routePrefix: '/swagger', // host at /swagger instead of default /docs
        swaggerOptions: {
          url: '/swagger.json' // example path to json
        }
      })
    )
    app.use(swagger.routes())

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

    const profileController = new ProfileController(services.errorService, authController)

    return {
      authController,
      profileController
    }
  })()

  // Routes
  const routes = (() => {
    const auth = authRoutes(core.app, controllers.authController)
    const profile = profileRoutes(core.app, controllers.profileController)
    return {
      auth,
      profile
    }
  })()
}

export default startServer
