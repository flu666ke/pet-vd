import Koa, { DefaultState, DefaultContext } from 'koa'
import bodyParser from 'koa-bodyparser'
import cors from 'koa2-cors'
import logger from 'koa-logger'
import dotenv from 'dotenv'

import auth from './routes/auth'
import DB from './db'
import { IConfig } from './config'

dotenv.config()

const startServer = (config: IConfig) => {
  const app = new Koa()

  DB.instance
  app.context.db = DB

  app.use(bodyParser())
  app.use(cors({ origin: '*' }))
  app.use(logger())

  app.use(auth.routes())

  app
    .listen(config.port, async () => {
      console.log(`Server listening on port: ${config.port}`)
    })
    .on('error', err => {
      console.error(err)
    })
}

export default startServer
