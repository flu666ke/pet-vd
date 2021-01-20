import nodemailer from 'nodemailer'
import { IConfig } from '../config'

export default class EmailService {
  private config: IConfig

  constructor(config: IConfig) {
    this.config = config
  }

  public sendActivationLink(email: string, uuid: string): void {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: this.config.activationEmailFrom,
        pass: this.config.activationEmailPassword
      }
    })

    const mailOptions = {
      from: this.config.activationEmailFrom,
      to: email,
      subject: 'Account activation link',
      html: `<h1>Please use the following link to activate your account</h1>
          <p>Click <a href=${this.config.clientURL}/auth-activate/${uuid}>here</a> to activate account</p>
          <hr />
          <p>This email may contain sensitive information</p>
          <p>${this.config.clientURL}</p>
          `
    }

    transporter.sendMail(mailOptions, (error, body) => {
      if (error) console.log(error)
    })
  }

  public sendRestorePasswordLink(email: string, uuid: string): void {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: this.config.activationEmailFrom,
        pass: this.config.activationEmailPassword
      }
    })

    const mailOptions = {
      from: this.config.activationEmailFrom,
      to: email,
      subject: `Password Reset link`,
      html: `
          <h1>Please use the following link to reset your password</h1>
          <p>${this.config.clientURL}/auth/password/reset/${uuid}</p>
          <hr />
          <p>This email may contain sensitive information</p>
          <p>${this.config.clientURL}</p>
      `
    }

    transporter.sendMail(mailOptions, (error, body) => {
      if (error) console.log(error)
    })
  }
}
