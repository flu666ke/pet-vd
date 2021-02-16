import Koa, { Context } from 'koa'
import Router from 'koa-router'
import VotingController from 'src/controllers/voting'

import { DataBase } from 'src/db'
import { DocsService } from 'src/module.docs/docsService'
import { serializeAllVoting } from './serialization'

export default function votingRoutes(app: Koa, votingController: VotingController, docs: DocsService) {
  const router = new Router()
  const DB: DataBase = app.context.db

  // Documentation
  // docs.composeWithDirectory(__dirname + '/docs')
  // docs.composeWithDirectory(__dirname + '/schemas', '/components/schemas')

  async function createVoting(ctx: Context) {
    try {
      const voting = await votingController.createVoting(ctx.request.body, DB)

      ctx.body = {
        message: voting
      }
    } catch (error) {
      ctx.status = error.httpStatus || 500
      ctx.body = {
        error: {
          message: error.message,
          ...error
        }
      }
    }
  }

  async function getAllVoting(ctx: Context) {
    try {
      const allVoting = await votingController.getAllVoting(DB)

      ctx.body = {
        allVoting: serializeAllVoting(allVoting)
      }
    } catch (error) {
      ctx.status = error.httpStatus || 500
      ctx.body = {
        error: {
          message: error.message,
          ...error
        }
      }
    }
  }

  router.post('/voting', createVoting)
  router.get('/voting', getAllVoting)

  app.use(router.routes())
}
