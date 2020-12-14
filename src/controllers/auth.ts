import { Context } from 'koa'
import { v4 as uuidv4 } from 'uuid'
import HelperService from '../helperService'
import { User } from '../models/user'

export default class AuthController {
  private helperService: HelperService

  constructor(helperService: HelperService) {
    this.helperService = helperService
  }

  async signup(ctx: Context) {
    const { email, password } = <User>ctx.request.body

    console.log({ email, password })
    console.log('this --- ', this)

    const selectEmail = `SELECT email FROM users WHERE email = '${email}'`
    const user = await ctx.app.context.db.runQuery(selectEmail)

    //TODO: Shows the page confirm email
    if (user) ctx.throw(400, 'email is taken')

    const hashedPassword = await this.helperService.getHashedPassword(password)

    const insertUser = `INSERT INTO users(email, password) VALUES ('${email}', '${hashedPassword}')`
    await ctx.app.context.db.runQuery(insertUser)

    const uuid = uuidv4()

    const currentDate = new Date()
    currentDate.setHours(currentDate.getHours() + 1)

    const expiresAt = this.helperService.getFormattedDate(currentDate)

    const insertActivation = `INSERT INTO activations(userId, uuid, expiresAt) VALUES (LAST_INSERT_ID(), '${uuid}', '${expiresAt}')`
    await ctx.app.context.db.runQuery(insertActivation)

    this.helperService.sendEmail(email, uuid)

    const expiresCookie = currentDate
    ctx.cookies.set('email', email, { expires: expiresCookie })

    ctx.body = {
      message: `Email has been sent to ${email}. Follow the instruction to activate your account`
    }
  }

  async accountActivation(ctx: Context) {
    const { activationId } = ctx.request.body
    const email = ctx.cookies.get('email')
    console.log({ email })

    try {
      const selectActivation = `SELECT * FROM activations WHERE uuid = '${activationId}'`
      const activation = await ctx.app.context.db.runQuery(selectActivation)

      if (new Date() > activation[0].expiresAt) ctx.throw(401, 'Confirmation time is expired.')

      const emailVerifyAt = this.helperService.getFormattedDate(new Date())

      const updateUser = `UPDATE users SET emailVerifiedAt = '${emailVerifyAt}' WHERE id = ${activation[0].userId}`
      await ctx.app.context.db.runQuery(updateUser)

      const deleteActivation = `DELETE FROM activations WHERE userId = ${activation[0].userId}`
      await ctx.app.context.db.runQuery(deleteActivation)

      ctx.body = {
        message: `Registration success`
      }
    } catch (error) {
      console.error(error)
    }
  }

  async signin(ctx: Context) {
    const { email, password } = <User>ctx.request.body
    console.log({ password })
    try {
      const selectUser = `SELECT email, password FROM users WHERE email = '${email}'`
      const user = await ctx.app.context.db.runQuery(selectUser)

      if (!user) ctx.throw(401, 'User with that email does not exists. Please signup')

      if (!this.helperService.isPasswordCompared(password, user[0].password))
        ctx.throw(401, 'Email and password do not match')

      ctx.body = {
        message: user[0].password
      }
    } catch (error) {
      ctx.throw(400, error)
    }
  }
}
