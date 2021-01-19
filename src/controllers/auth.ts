import { Context } from 'koa'
import { UpdatePassword } from 'src/models/updatePassword'
import { v4 as uuidv4 } from 'uuid'
import HelperService from '../helperService'
import { User } from '../models/user'

export default class AuthController {
  private helperService: HelperService

  constructor(helperService: HelperService) {
    this.helperService = helperService
  }

  async getUser(ctx: Context) {
    try {
      const accessToken = ctx.cookies.get('accessToken')

      const selectUser = `SELECT * FROM users WHERE id IN (SELECT userId FROM accessTokens WHERE accessToken = '${accessToken}')`
      const user = await ctx.app.context.db.runQuery(selectUser)

      ctx.body = {
        user: user[0]
      }
    } catch (error) {
      ctx.status = error.status || 500
      ctx.body = error.message
    }
  }

  async signup(ctx: Context) {
    const { firstName, lastName, email, password } = <User>ctx.request.body

    try {
      const selectEmail = `SELECT email FROM users WHERE email = '${email}'`
      const user = await ctx.app.context.db.runQuery(selectEmail)

      //TODO: Shows the page confirm email
      if (user) ctx.throw(400, 'email is taken')

      const hashedPassword = await this.helperService.getHashedPassword(password)

      const insertUser = `INSERT INTO users(firstName, lastName, email, password) VALUES ('${firstName}', '${lastName}', '${email}', '${hashedPassword}')`
      await ctx.app.context.db.runQuery(insertUser)

      const uuid = uuidv4()

      const currentDate = new Date()
      currentDate.setHours(currentDate.getHours() + 1)

      const expiresAt = this.helperService.getFormattedDate(currentDate)

      const insertActivation = `INSERT INTO activations(userId, activationId, expiresAt) VALUES (LAST_INSERT_ID(), '${uuid}', '${expiresAt}')`
      await ctx.app.context.db.runQuery(insertActivation)

      this.helperService.sendEmail(email, uuid)

      // const expiresCookie = currentDate
      // ctx.cookies.set('email', email, { expires: expiresCookie })

      ctx.body = {
        message: `Email has been sent to ${email}. Follow the instruction to activate your account`
      }
    } catch (error) {
      ctx.status = error.status || 500
      ctx.body = error.message
    }
  }

  async accountActivation(ctx: Context) {
    const { activationId } = ctx.request.body

    try {
      const selectActivation = `SELECT * FROM activations WHERE activationId = '${activationId}'`
      const activation = await ctx.app.context.db.runQuery(selectActivation)

      if (!activation) ctx.throw(401, 'Activation link already used.')
      if (new Date() > activation[0].expiresAt) ctx.throw(401, 'Confirmation time is expired.')

      const emailVerifiedAt = this.helperService.getFormattedDate(new Date())

      const updateUser = `UPDATE users SET emailVerifiedAt = '${emailVerifiedAt}' WHERE id = ${activation[0].userId}`
      await ctx.app.context.db.runQuery(updateUser)

      const uuid = uuidv4()
      const currentDate = new Date()
      currentDate.setHours(currentDate.getHours() + 1)

      const expiresAt = this.helperService.getFormattedDate(currentDate)

      const insertAccessToken = `INSERT INTO accessTokens(userId, accessToken, expiresAt) VALUES ('${activation[0].userId}', '${uuid}', '${expiresAt}')`
      await ctx.app.context.db.runQuery(insertAccessToken)

      const deleteActivation = `DELETE FROM activations WHERE userId = ${activation[0].userId}`
      await ctx.app.context.db.runQuery(deleteActivation)

      const expiresCookie = currentDate
      ctx.cookies.set('accessToken', uuid, { expires: expiresCookie })

      ctx.body = {
        message: `Registration success`,
        success: true
      }
    } catch (error) {
      ctx.status = error.status || 500
      ctx.body = error.message
    }
  }

  async getActivationLink(ctx: Context) {
    const email = ctx.cookies.get('email')
    console.log({ email })

    try {
      const uuid = uuidv4()

      const currentDate = new Date()
      currentDate.setHours(currentDate.getHours() + 1)

      const expiresAt = this.helperService.getFormattedDate(currentDate)

      const selectUser = `SELECT * FROM users WHERE email = '${email}'`
      const user = await ctx.app.context.db.runQuery(selectUser)

      const insertActivation = `INSERT INTO activations(userId, activationId, expiresAt) VALUES ('${user[0].id}', '${uuid}', '${expiresAt}')`
      await ctx.app.context.db.runQuery(insertActivation)

      this.helperService.sendEmail(email!, uuid)

      const expiresCookie = currentDate
      ctx.cookies.set('accessToken', uuid, { expires: expiresCookie })

      ctx.body = {
        message: `Email has been sent to ${email}. Follow the instruction to activate your account`
      }
    } catch (error) {
      ctx.status = error.status || 500
      ctx.body = error.message
    }
  }

  async signin(ctx: Context) {
    const { email, password } = <User>ctx.request.body
    console.log({ password })
    try {
      const selectUser = `SELECT email, password, emailVerifiedAt FROM users WHERE email = '${email}'`
      const user = await ctx.app.context.db.runQuery(selectUser)

      if (!user) ctx.throw(401, 'User with that email does not exists. Please signup')

      if (!user[0].emailVerifiedAt) ctx.throw(401, 'User with that email does not activate')

      if (!this.helperService.comparePassword(password, user[0].password))
        ctx.throw(401, 'Email and password do not match')

      const currentDate = new Date()
      currentDate.setHours(currentDate.getHours() + 1)
      const uuid = uuidv4()
      const expiresCookie = currentDate

      ctx.cookies.set('accessToken', uuid, { expires: expiresCookie })

      ctx.body = {
        message: 'Login successful'
      }
    } catch (error) {
      ctx.status = error.status || 500
      ctx.body = error.message
    }
  }

  async forgotPassword(ctx: Context) {
    const { email } = <User>ctx.request.body
    console.log({ email })
  }

  async restorePassword(ctx: Context) {
    const { resetPasswordLink, newPassword } = <UpdatePassword>ctx.request.body
    console.log({ resetPasswordLink, newPassword })
  }
}
