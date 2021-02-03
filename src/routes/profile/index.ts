import Koa, { Context } from 'koa'
import Router from 'koa-router'

import ProfileController from 'src/controllers/profile'
import { checkCookies } from '../../middleware/checkCookies'
import { serializeProfile, serializeProfiles } from './serialization'
import { IUpdateProfile } from 'src/interfaces/updateProfile'
import { DataBase } from 'src/db'
import { DocsService } from 'src/module.docs/docsService'
import { validateInputData } from '../../middleware/validateInputData'

export default function profileRoutes(app: Koa, profileController: ProfileController, docs: DocsService) {
  const router = new Router()
  const DB: DataBase = app.context.db

  // Documentation
  docs.composeWithDirectory(__dirname + '/docs')
  docs.composeWithDirectory(__dirname + '/schemas', '/components/schemas')

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

  async function getAllProfiles(ctx: Context) {
    try {
      const accessToken = ctx.cookies.get('accessToken')
      const profiles = await profileController.getAllProfiles(accessToken!, DB)

      ctx.body = {
        profiles: serializeProfiles(profiles)
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
  router.patch(
    '/update-profile',
    checkCookies,
    validateInputData('../routes/profile/docs/components/schemas/UpdateProfile.json'),
    updateProfile
  )
  router.delete('/delete-account', checkCookies, deleteAccount)

  router.get('/profiles', checkCookies, getAllProfiles)

  app.use(router.routes())
}
