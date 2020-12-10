import Router from 'koa-router'

import { authController } from '../controllers/auth'

const router = new Router()

router.post('/signup', authController.signup)

router.post('/account-activation', authController.accountActivation)
router.post('/signin', authController.signin)

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

export default router
