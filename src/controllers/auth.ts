import nodemailer from 'nodemailer'
import jwt from 'jsonwebtoken'
import { User } from '../models/user'

export default class AuthController {
  // private runner: ExpressRunnerModule

  constructor() {
    // runner: ExpressRunnerModule,
    // this.runner = runner
  }

  // async createPostReport(reportCreate: PostReportCreate): Promise<void> {
  //   // const { errors } = this.runner
  //   // const { knex } = this.database
  //   // const { Post, PostReport } = this.bounceModel

  //   await transaction(knex, async trx => {
  //     await PostReport.query(trx).insert({
  //       ownerId: reportCreate.profileId,
  //       postId: reportCreate.postId,
  //       message: reportCreate.message
  //     })
  //   })
  // }

  async signup(ctx: any) {
    const { email, password } = <User>ctx.request.body

    const dbQuery = `SELECT email FROM profile WHERE email = '${email}'`

    const user = await ctx.app.context.db.runQuery(dbQuery)

    console.log({ user })

    if (user) ctx.throw(400, 'email is taken')

    const token = jwt.sign({ email, password }, process.env.JWT_ACCOUNT_ACTIVATION || '', {
      expiresIn: '10m'
    })

    console.log({ token })

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
      text: `
    <h1>Please use the following link to activate your account</h1>
    <p>${process.env.CLIENT_URL}/auth/activate/${token}</p>
    <hr />
    <p>This email may contain sensitive information</p>
    <p>${process.env.CLIENT_URL}</p>
    `
    }

    transporter.sendMail(mailOptions, (error, body) => {
      console.log('here?')
      if (error) ctx.throw(400, error)

      ctx.body = {
        message: `Email has been sent to ${email}. Follow the instruction to activate your account`
      }
    })

    try {
      ctx.body = {
        status: 'success',
        data: 'pong'
      }
    } catch (error) {
      console.error(error)
    }

    // await next()
  }
}

export const authController = new AuthController()
