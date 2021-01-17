import Koa, { Context } from 'koa'
import Router from 'koa-router'
import AuthController from '../controllers/auth'

import { checkCookies } from '../middlewares/checkCookies'
import { validateInputData } from '../validators/auth/auth'

export default function authRoutes(app: Koa, authController: AuthController) {
  const router = new Router()

  async function getUser(ctx: Context) {
    await authController.getUser(ctx)
  }

  async function signup(ctx: Context) {
    await authController.signup(ctx)
  }

  async function accountActivation(ctx: Context) {
    await authController.accountActivation(ctx)
  }

  async function getActivationLink(ctx: Context) {
    await authController.getActivationLink(ctx)
  }

  async function signin(ctx: Context) {
    await authController.signin(ctx)
  }

  async function forgotPassword(ctx: Context) {
    await authController.forgotPassword(ctx)
  }

  async function restorePassword(ctx: Context) {
    await authController.restorePassword(ctx)
  }

  router.get('/', checkCookies, getUser)

  router.post('/signup', validateInputData, signup)
  router.post('/account-activation', accountActivation)
  router.get('/activation-link', getActivationLink)
  router.post('/signin', signin)

  router.put('/forgot-password', forgotPassword)

  router.put('/restore-password', restorePassword)

  // router.delete("/delete-user/:userId", deleteUser);
  app.use(router.routes())
}
