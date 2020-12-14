import Koa, { Context } from 'koa'
import Router from 'koa-router'
import AuthController from '../controllers/auth'

import { checkCookies } from '../middlewares/checkCookies'
import { validateInputData } from '../validators/auth/auth'

export default function authRoutes(app: Koa, authController: AuthController) {
  const router = new Router()

  async function signup(ctx: Context) {
    await authController.signup(ctx)
  }

  async function accountActivation(ctx: Context) {
    await authController.accountActivation(ctx)
  }

  router.post('/signup', checkCookies, validateInputData, signup)
  router.post('/account-activation', accountActivation)
  router.post('/signin', authController.signin)
  app.use(router.routes())
}

// // forgot reset password
// router.put(
//   "/forgot-password",
//   forgotPasswordValidator,
//   runValidation,
//   forgotPassword
// );

// router.put(
//   "/restore-password",
//   resetPasswordValidator,
//   runValidation,
//   resetPassword
// );

// router.delete("/delete-user/:userId", deleteUser);

// export default router
