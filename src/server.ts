import Koa, { Context } from 'koa'
import bodyParser from 'koa-bodyparser'
import cors from 'koa2-cors'
import logger from 'koa-logger'

import DB from './db'
import { IConfig } from './config'
import HelperService from './helperService'
import authRoutes from './routes/authRoutes'
import AuthController from './controllers/auth'
import Router from 'koa-router'

const startServer = (config: IConfig) => {
  // Core
  const core = (() => {
    const app: Koa = new Koa()
    const router = new Router()

    DB.instance
    app.context.db = DB

    app.use(bodyParser())
    app.use(cors({ origin: '*' }))
    app.use(logger())

    router.get('/vehicles', (ctx: Context) => {
      const owners = [
        { id: 1, vehicle: 'car', ownerName: 'bruno' },
        { id: 2, vehicle: 'bike', ownerName: 'john' },
        { id: 3, vehicle: 'airplane', ownerName: 'brunmicko' }
      ]

      ctx.body = owners
    })

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
    const helperService = new HelperService(config)

    return {
      helperService
    }
  })()

  // Controllers
  const controllers = (() => {
    const authController = new AuthController(services.helperService)

    return {
      authController
    }
  })()

  // Routes
  const routes = (() => {
    const auth = authRoutes(core.app, controllers.authController)
    return {
      auth
    }
  })()
}

export default startServer
