import bcrypt from 'bcrypt'
import nodemailer from 'nodemailer'
import { format } from 'date-fns'

export const getFormattedDate = (date: Date): string => {
  return format(date, 'yyyy-MM-dd HH:mm:ss')
}

export const getExpirationDate = (expirationTime: number): number => {
  const date = new Date()

  return date.setHours(date.getHours() + expirationTime)
}

export const getHashedPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(parseInt(process.env.SALT || '7'))
  return bcrypt.hashSync(password, salt)
}

export const isPasswordCompared = (password: string, hasshedPassword: string): boolean => {
  return bcrypt.compareSync(password, hasshedPassword)
}

export const sendEmail = (email: string, uuid: string): void => {
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
    if (error) console.log(error)
  })
}
