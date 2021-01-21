import Koa, { Context } from 'koa'
import Router from 'koa-router'

import ProfileController from 'src/controllers/profile'
import { checkCookies } from '../middleware/checkCookies'

export default function profileRoutes(app: Koa, profileController: ProfileController) {
  const router = new Router()
  const DB = app.context.db

  async function getProfile(ctx: Context) {
    try {
      const accessToken = ctx.cookies.get('accessToken')

      const user = await profileController.getProfile(accessToken!, DB)

      ctx.body = {
        user
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

  async function updateProfile(ctx: Context) {
    try {
      const accessToken = ctx.cookies.get('accessToken')

      const user = await profileController.updateProfile(accessToken!, DB)

      ctx.body = {
        user
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

  router.get('/', checkCookies, getProfile)
  router.patch('/update-profile', checkCookies, updateProfile)
  // router.delete("/delete-user/:userId", deleteUser);

  app.use(router.routes())
}
