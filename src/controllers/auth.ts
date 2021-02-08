import { v4 as uuidv4 } from 'uuid'
import bcrypt from 'bcrypt'
import { User } from '../models/user'
import { IConfig } from 'src/config'
import EmailService from 'src/module.email/emailService'
import ErrorService from 'src/module.error/errorService'
import HelperService from 'src/module.helper/helperService'
import { DataBase } from 'src/db'
import { Activation } from 'src/models/activation'
import { RestorePassword } from 'src/models/restorePassword'

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

  async signup({ firstName, lastName, email, password }: User, DB: DataBase): Promise<void> {
    const selectEmail = `SELECT email FROM users WHERE email = '${email}'`
    const user = await DB.runQuery(selectEmail)

    if (user) {
      this.errorService.badRequest('Email is taken.')
    }

    const hashedPassword = await this.getHashedPassword(password)

    const insertUser = `INSERT INTO users( email, password) VALUES ( '${email}', '${hashedPassword}')`
    const createdUser = await DB.runQuery(insertUser)

    const insertProfile = `INSERT INTO profiles(userId, firstName, lastName) VALUES (${createdUser.insertId},'${firstName}', '${lastName}')`
    await DB.runQuery(insertProfile)

    const uuid = uuidv4()

    const expirationDate = this.helperService.getExpirationDate()

    const insertActivation = `INSERT INTO activations(userId, activationId, expiresAt) VALUES (${createdUser.insertId}, '${uuid}', '${expirationDate}')`
    await DB.runQuery(insertActivation)

    this.emailService.sendActivationLink(email, uuid)
  }

  async accountActivation(activationId: string, DB: DataBase): Promise<{ uuid: string; expirationDate: string }> {
    const selectActivation = `SELECT * FROM activations WHERE activationId = '${activationId}'`
    const activation: Activation[] = await DB.runQuery(selectActivation)

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
    const expirationDate = this.helperService.getExpirationDate()

    const insertAccessToken = `INSERT INTO accessTokens(userId, accessToken, expiresAt) VALUES ('${activation[0].userId}', '${uuid}', '${expirationDate}')`
    await DB.runQuery(insertAccessToken)

    const deleteActivation = `DELETE FROM activations WHERE userId = ${activation[0].userId}`
    await DB.runQuery(deleteActivation)

    return { uuid, expirationDate }
  }

  async getActivationLink(email: string, DB: DataBase): Promise<void> {
    const uuid = uuidv4()

    const expirationDate = this.helperService.getExpirationDate()

    const selectUser = `SELECT * FROM users WHERE email = '${email}'`
    const user = await DB.runQuery(selectUser)

    if (!user) {
      this.errorService.unauthorized('User with that email does not exists. Please signup.')
    }

    const insertActivation = `INSERT INTO activations(userId, activationId, expiresAt) VALUES ('${user[0].id}', '${uuid}', '${expirationDate}')`
    await DB.runQuery(insertActivation)

    this.emailService.sendActivationLink(email!, uuid)
  }

  async signin({ email, password }: User, DB: DataBase) {
    const selectUser = `SELECT id, password, emailVerifiedAt FROM users WHERE email = '${email}'`
    const user: User[] = await DB.runQuery(selectUser)

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
    const expirationDate = this.helperService.getExpirationDate()

    const insertAccessToken = `INSERT INTO accessTokens(userId, accessToken, expiresAt) VALUES ('${user[0].id}', '${uuid}', '${expirationDate}')`
    await DB.runQuery(insertAccessToken)

    return { uuid, expirationDate }
  }

  async forgotPassword(email: string, DB: DataBase): Promise<void> {
    const uuid = uuidv4()

    const expirationDate = this.helperService.getExpirationDate()

    const selectUser = `SELECT * FROM users WHERE email = '${email}'`
    const user: User[] = await DB.runQuery(selectUser)

    if (!user) {
      this.errorService.unauthorized('User with that email does not exists. Please signup.')
    }

    const insertRestorePasswordLink = `INSERT INTO restorePasswords(userId, restorePasswordId, expiresAt) VALUES ('${user[0].id}', '${uuid}', '${expirationDate}')`
    await DB.runQuery(insertRestorePasswordLink)

    this.emailService.sendRestorePasswordLink(email, uuid)
  }

  async restorePassword(resetPasswordLink: string, newPassword: string, DB: DataBase): Promise<void> {
    const selectRestorePassword = `SELECT * FROM restorePasswords WHERE restorePasswordId = '${resetPasswordLink}'`
    const restorePassword: RestorePassword[] = await DB.runQuery(selectRestorePassword)

    if (!restorePassword) {
      this.errorService.unauthorized('Activation link already used.')
    }

    if (new Date() > restorePassword[0].expiresAt) {
      this.errorService.unauthorized('Restore password link is expired.')
    }

    const hashedPassword = await this.getHashedPassword(newPassword)

    const updateUserPassword = `UPDATE users SET password = '${hashedPassword}' WHERE id = ${restorePassword[0].userId}`
    await DB.runQuery(updateUserPassword)

    const deleteRestorePassword = `DELETE FROM restorePasswords WHERE restorePasswordId = '${resetPasswordLink}'`
    await DB.runQuery(deleteRestorePassword)
  }

  async logout(accessToken: string, DB: DataBase): Promise<void> {
    const deleteAccessToken = `DELETE FROM accessTokens WHERE accessToken = '${accessToken}'`
    await DB.runQuery(deleteAccessToken)
  }

  async getHashedPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(parseInt(this.config.salt || '7'))
    return bcrypt.hashSync(password, salt)
  }

  comparePassword(password: string, hashedPassword: string): boolean {
    return bcrypt.compareSync(password, hashedPassword)
  }

  async removeExpiredActivationLinks(updateDate: string, DB: DataBase): Promise<void> {
    const deleteActivation = `DELETE FROM activations WHERE expiresAt < '${updateDate}'`
    await DB.runQuery(deleteActivation)
  }
}
