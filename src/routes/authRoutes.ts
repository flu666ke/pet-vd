import Koa, { Context } from 'koa'
import Router from 'koa-router'
import { v4 as uuidv4 } from 'uuid'
import { User } from 'src/models/user'
import HelperService from 'src/module.helper/helperService'
import AuthController from '../controllers/auth'

import { checkCookies } from '../middleware/checkCookies'
import { validateInputData } from '../validators/auth/auth'
import { UpdatePassword } from 'src/models/updatePassword'

export default function authRoutes(app: Koa, authController: AuthController, helperService: HelperService) {
  const router = new Router()
  const DB = app.context.db

  async function getProfile(ctx: Context) {
    try {
      const accessToken = ctx.cookies.get('accessToken')

      const user = await authController.getProfile(accessToken!, DB)

      ctx.body = {
        user
      }
    } catch (error) {
      ctx.status = error.httpCode || 500
      ctx.body = { error: { message: error.message, httpCode: error.httpCode, statusCode: error.statusCode } }
    }
  }

  async function signup(ctx: Context) {
    const { firstName, lastName, email, password } = <User>ctx.request.body

    try {
      await authController.signup({ firstName, lastName, email, password }, DB)
      ctx.body = {
        message: `Email has been sent to ${email}. Follow the instruction to activate your account.`
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

  async function accountActivation(ctx: Context) {
    const { activationId } = ctx.request.body

    try {
      const { uuid, expirationDate } = await authController.accountActivation(activationId, DB)

      ctx.cookies.set('accessToken', uuid, { expires: new Date(expirationDate) })

      ctx.body = {
        message: `Registration success`
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

  async function getActivationLink(ctx: Context) {
    try {
      const { email } = <User>ctx.request.body
      await authController.getActivationLink(email, DB)
      ctx.body = {
        message: `Email has been sent to ${email}. Follow the instruction to activate your account.`
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

  async function signin(ctx: Context) {
    const { email, password } = <User>ctx.request.body

    try {
      const user = await authController.signin({ email, password }, DB)
      const uuid = uuidv4()
      const expirationDate = helperService.getExpirationDate(1)

      ctx.cookies.set('accessToken', uuid, { expires: new Date(expirationDate) })

      ctx.body = {
        message: 'Login successful',
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

  async function forgotPassword(ctx: Context) {
    const { email } = <User>ctx.request.body

    try {
      await authController.forgotPassword(email, DB)

      ctx.body = {
        message: `Email has been sent to ${email}. Follow the instruction to restore your password.`
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

  async function restorePassword(ctx: Context) {
    const { resetPasswordLink, newPassword } = <UpdatePassword>ctx.request.body
    try {
      await authController.restorePassword(resetPasswordLink, newPassword, DB)

      ctx.body = {
        message: 'Great! Now you can login with your new password.'
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

  router.post('/signup', validateInputData, signup)
  router.post('/account-activation', accountActivation)
  router.post('/activation-link', getActivationLink)
  router.post('/signin', signin)

  router.post('/forgot-password', forgotPassword)

  router.post('/restore-password', restorePassword)

  // router.delete("/delete-user/:userId", deleteUser);
  app.use(router.routes())
}
