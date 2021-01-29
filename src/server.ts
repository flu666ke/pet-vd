import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
import cors from 'koa2-cors'
import logger from 'koa-logger'

import DB from './db'
import { IConfig } from './config'
import AuthController from './controllers/auth'
import Router from 'koa-router'
import EmailService from './module.email/emailService'
import ErrorService from './module.error/errorService'
import HelperService from './module.helper/helperService'
import docsModule from './module.docs/docsService'
import ProfileController from './controllers/profile'
import profileRoutes from './routes/profile'
import authRoutes from './routes/auth'
import ChatController from './controllers/chat'
import chatRoutes from './routes/chat'

const startServer = (config: IConfig) => {
  // Core
  const core = (() => {
    const app: Koa = new Koa()
    const router = new Router()

    DB.instance
    app.context.db = DB

    const docs = docsModule(app)

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
      app,
      docs
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
    const chatController = new ChatController(services.helperService, services.errorService)

    return {
      authController,
      profileController,
      chatController
    }
  })()

  // Routes
  const routes = (() => {
    const auth = authRoutes(core.app, controllers.authController, core.docs)
    const profile = profileRoutes(core.app, controllers.profileController, core.docs)
    const chat = chatRoutes(core.app, controllers.chatController, core.docs)

    core.docs.createSwaggerDocs()

    return {
      auth,
      profile,
      chat
    }
  })()
}

export default startServer
