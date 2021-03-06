import Koa, { Context } from 'koa'
import Router from 'koa-router'
import ChatController from 'src/controllers/chat'

import { DataBase } from 'src/db'
import { DocsService } from 'src/module.docs/docsService'
import { serializeChat, serializeMessage } from './serialization'

export default function chatRoutes(app: Koa, chatController: ChatController, docs: DocsService) {
  const router = new Router()
  const DB: DataBase = app.context.db

  // Documentation
  docs.composeWithDirectory(__dirname + '/docs')
  docs.composeWithDirectory(__dirname + '/schemas', '/components/schemas')

  async function createChat(ctx: Context) {
    try {
      const chat = await chatController.createChat(ctx.request.body, DB)

      ctx.body = {
        chat: serializeChat(chat)
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

  async function sendMessage(ctx: Context) {
    try {
      const message = await chatController.sendMessage(ctx.request.body, DB)

      ctx.body = {
        message: serializeMessage(message)
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

  router.post('/chat', createChat)
  router.post('/message', sendMessage)

  app.use(router.routes())
}
