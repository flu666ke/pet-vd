import Koa, { Context } from 'koa'
import Router from 'koa-router'

import ProfileController from 'src/controllers/profile'
import { checkCookies } from '../../middleware/checkCookies'
import serializeProfile from './serialization'
import { IUpdateProfile } from 'src/interfaces/updateProfile'
import { DataBase } from 'src/db'

export default function profileRoutes(app: Koa, profileController: ProfileController) {
  const router = new Router()
  const DB: DataBase = app.context.db

  async function getProfile(ctx: Context) {
    try {
      const accessToken = ctx.cookies.get('accessToken')

      const profile = await profileController.getProfile(accessToken!, DB)

      ctx.body = {
        user: serializeProfile(profile)
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
      const updateProfile = <IUpdateProfile>ctx.request.body

      const profile = await profileController.updateProfile(updateProfile, accessToken!, DB)

      ctx.body = {
        message: `Account updated successfully`,
        user: serializeProfile(profile)
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

  async function deleteAccount(ctx: Context) {
    try {
      const accessToken = ctx.cookies.get('accessToken')

      await profileController.deleteAccount(accessToken!, DB)
      ctx.cookies.set('accessToken', '')

      ctx.body = {
        message: `Account deleted successfully`
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
  router.delete('/delete-account', checkCookies, deleteAccount)

  app.use(router.routes())
}
