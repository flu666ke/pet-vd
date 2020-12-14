import bcrypt from 'bcrypt'
import nodemailer from 'nodemailer'
import { format } from 'date-fns'
import { IConfig } from './config'

export default class HelperService {
  private config: IConfig

  constructor(config: IConfig) {
    this.config = config
  }

  getFormattedDate(date: Date): string {
    return format(date, 'yyyy-MM-dd HH:mm:ss')
  }

  getExpirationDate(hours: number): number {
    const date = new Date()

    return date.setHours(date.getHours() + hours)
  }

  async getHashedPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(parseInt(this.config.salt || '7'))
    return bcrypt.hashSync(password, salt)
  }

  isPasswordCompared(password: string, hasshedPassword: string): boolean {
    return bcrypt.compareSync(password, hasshedPassword)
  }

  sendEmail(email: string, uuid: string): void {
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
      text: `<h1>Please use the following link to activate your account</h1>
          <p>${this.config.clientURL}/auth/activate/${uuid}</p>
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
