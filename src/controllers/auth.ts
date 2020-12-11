import { Context } from 'koa'
import nodemailer from 'nodemailer'
import bcrypt from 'bcrypt'
import { format } from 'date-fns'
import { v4 as uuidv4 } from 'uuid'
import { User } from '../models/user'

export default class AuthController {
  async signup(ctx: Context) {
    const { email, password } = <User>ctx.request.body

    const selectEmail = `SELECT email FROM users WHERE email = '${email}'`
    const user = await ctx.app.context.db.runQuery(selectEmail)

    //TODO: Shows the page confirm email
    if (user) ctx.throw(400, 'email is taken')

    const salt = await bcrypt.genSalt(parseInt(process.env.SALT || '7'))
    const hashedPassword = bcrypt.hashSync(password, salt)

    const insertUser = `INSERT INTO users(email, password) VALUES ('${email}', '${hashedPassword}')`
    await ctx.app.context.db.runQuery(insertUser)

    const uuid = uuidv4()

    const date = new Date()

    date.setHours(date.getHours() + 1)

    const expiresAt = format(date, 'yyyy-MM-dd HH:mm:ss')

    const insertActivation = `INSERT INTO activations(userId, uuid, expiresAt) VALUES (LAST_INSERT_ID(), '${uuid}', '${expiresAt}')`
    await ctx.app.context.db.runQuery(insertActivation)

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.ACTIVATION_EMAIL_FROM,
        pass: process.env.ACTIVATION_EMAIL_PASSWORD
      }
    })

    const mailOptions = {
      from: process.env.ACTIVATION_EMAIL_FROM,
      to: email,
      subject: 'Account activation link',
      text: `<h1>Please use the following link to activate your account</h1>
            <p>${process.env.CLIENT_URL}/auth/activate/${uuid}</p>
            <hr />
            <p>This email may contain sensitive information</p>
            <p>${process.env.CLIENT_URL}</p>
            `
    }

    transporter.sendMail(mailOptions, (error, body) => {
      if (error) ctx.throw(400, error)
    })

    const expiresCookie = date

    console.log({ expiresCookie })
    ctx.cookies.set('email', email, { expires: expiresCookie })

    console.log('here?')
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

      const emailVerifyAt = format(new Date(), 'yyyy-MM-dd HH:mm:ss')

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

      if (!bcrypt.compareSync(password, user[0].password)) ctx.throw(401, 'Email and password do not match')

      console.log({ user })

      ctx.body = {
        message: user[0].password
      }
    } catch (error) {
      ctx.throw(400, error)
    }
  }
}

export const authController = new AuthController()
