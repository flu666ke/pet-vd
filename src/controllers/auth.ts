import { v4 as uuidv4 } from 'uuid'
import bcrypt from 'bcrypt'
import { User } from '../models/user'
import { IConfig } from 'src/config'
import EmailService from 'src/module.email/emailService'
import ErrorService from 'src/module.error/errorService'
import HelperService from 'src/module.helper/helperService'

export default class AuthController {
  private emailService: EmailService
  private errorService: ErrorService
  private helperService: HelperService
  private config: IConfig

  constructor(emailService: EmailService, errorService: ErrorService, helperService: HelperService, config: IConfig) {
    this.emailService = emailService
    this.errorService = errorService
    this.helperService = helperService

    this.config = config
  }

  async signup({ firstName, lastName, email, password }: User, DB: any) {
    const selectEmail = `SELECT email FROM users WHERE email = '${email}'`
    const user = await DB.runQuery(selectEmail)

    if (user) {
      this.errorService.badRequest('Email is taken.')
    }

    const hashedPassword = await this.getHashedPassword(password)
    const insertUser = `INSERT INTO users(firstName, lastName, email, password) VALUES ('${firstName}', '${lastName}', '${email}', '${hashedPassword}')`
    await DB.runQuery(insertUser)

    const uuid = uuidv4()

    const expirationDate = this.helperService.getExpirationDate(1)
    const insertActivation = `INSERT INTO activations(userId, activationId, expiresAt) VALUES (LAST_INSERT_ID(), '${uuid}', '${expirationDate}')`
    await DB.runQuery(insertActivation)

    this.emailService.sendActivationLink(email, uuid)
  }

  async accountActivation(activationId: string, DB: any) {
    const selectActivation = `SELECT * FROM activations WHERE activationId = '${activationId}'`
    const activation = await DB.runQuery(selectActivation)

    if (!activation) {
      this.errorService.expiredLink('Activation link already used.')
    }

    if (new Date() > activation[0].expiresAt) {
      this.errorService.expiredLink('Confirmation time is expired.')
    }

    const emailVerifiedAt = this.helperService.getFormattedDate(new Date())

    const updateUser = `UPDATE users SET emailVerifiedAt = '${emailVerifiedAt}' WHERE id = ${activation[0].userId}`
    await DB.runQuery(updateUser)

    const uuid = uuidv4()
    const expirationDate = this.helperService.getExpirationDate(1)

    const insertAccessToken = `INSERT INTO accessTokens(userId, accessToken, expiresAt) VALUES ('${activation[0].userId}', '${uuid}', '${expirationDate}')`
    await DB.runQuery(insertAccessToken)

    const deleteActivation = `DELETE FROM activations WHERE userId = ${activation[0].userId}`
    await DB.runQuery(deleteActivation)

    return { uuid, expirationDate }
  }

  async getActivationLink(email: string, DB: any) {
    const uuid = uuidv4()

    const expirationDate = this.helperService.getExpirationDate(1)

    const selectUser = `SELECT * FROM users WHERE email = '${email}'`
    const user = await DB.runQuery(selectUser)

    if (!user) {
      this.errorService.unauthorized('User with that email does not exists. Please signup.')
    }

    const insertActivation = `INSERT INTO activations(userId, activationId, expiresAt) VALUES ('${user[0].id}', '${uuid}', '${expirationDate}')`
    await DB.runQuery(insertActivation)

    this.emailService.sendActivationLink(email!, uuid)
  }

  async signin({ email, password }: User, DB: any) {
    const selectUser = `SELECT id, password, emailVerifiedAt FROM users WHERE email = '${email}'`
    const user = await DB.runQuery(selectUser)

    if (!user) {
      this.errorService.unauthorized('User with that email does not exists. Please signup.')
    }

    if (!user[0].emailVerifiedAt) {
      this.errorService.expiredLink('User with that email does not activate.')
    }

    if (!this.comparePassword(password, user[0].password)) {
      this.errorService.unauthorized('Email and password do not match.')
    }

    const uuid = uuidv4()
    const expirationDate = this.helperService.getExpirationDate(1)

    console.log(user[0])

    const insertAccessToken = `INSERT INTO accessTokens(userId, accessToken, expiresAt) VALUES ('${user[0].id}', '${uuid}', '${expirationDate}')`
    await DB.runQuery(insertAccessToken)

    return { user: user[0], uuid, expirationDate }
  }

  async forgotPassword(email: string, DB: any) {
    const uuid = uuidv4()

    const expirationDate = this.helperService.getExpirationDate(1)

    const selectUser = `SELECT * FROM users WHERE email = '${email}'`
    const user = await DB.runQuery(selectUser)

    const insertRestorePasswordLink = `INSERT INTO restorePasswords(userId, uuid, expiresAt) VALUES ('${user[0].id}', '${uuid}', '${expirationDate}')`
    await DB.runQuery(insertRestorePasswordLink)

    this.emailService.sendRestorePasswordLink(email, uuid)
  }

  async restorePassword(resetPasswordLink: string, newPassword: string, DB: any) {
    const selectRestorePassword = `SELECT * FROM restorePasswords WHERE uuid = '${resetPasswordLink}'`
    const restorePassword = await DB.runQuery(selectRestorePassword)

    if (!restorePassword) {
      this.errorService.unauthorized('Activation link already used.')
    }

    if (new Date() > restorePassword[0].expiresAt) {
      this.errorService.unauthorized('Confirmation time is expired.')
    }

    const hashedPassword = await this.getHashedPassword(newPassword)

    const updateUserPassword = `UPDATE users SET password = '${hashedPassword}' WHERE id = ${restorePassword[0].userId}`
    await DB.runQuery(updateUserPassword)
  }

  async logout(accessToken: string, DB: any) {
    const deleteAccessToken = `DELETE FROM accessTokens WHERE accessToken = '${accessToken}'`
    await DB.runQuery(deleteAccessToken)
  }

  async getHashedPassword(password: string) {
    const salt = await bcrypt.genSalt(parseInt(this.config.salt || '7'))
    return bcrypt.hashSync(password, salt)
  }

  comparePassword(password: string, hashedPassword: string): boolean {
    return bcrypt.compareSync(password, hashedPassword)
  }
}
