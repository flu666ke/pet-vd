import { Context } from 'koa'
import { Connection } from 'mysql'

export interface CTX extends Context {
  db: Connection
}
