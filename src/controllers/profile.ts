import { User } from '../models/user'
import ErrorService from 'src/module.error/errorService'
import { UpdateProfile } from 'src/models/updateProfile'
import AuthController from './auth'

export default class ProfileController {
  private errorService: ErrorService
  private authController: AuthController

  constructor(errorService: ErrorService, authController: AuthController) {
    this.errorService = errorService
    this.authController = authController
  }

  async getProfile(accessToken: string, DB: any): Promise<User> {
    const selectUser = `SELECT * FROM users WHERE id IN (SELECT userId FROM accessTokens WHERE accessToken = '${accessToken}')`
    const user = await DB.runQuery(selectUser)

    if (!user) {
      this.errorService.unauthorized('User not authorized.')
    }

    return user[0]
  }

  async updateProfile(profile: UpdateProfile, accessToken: string, DB: any): Promise<User> {
    const { firstName, lastName, gender, newPassword, oldPassword } = profile

    const selectUser = `SELECT * FROM users WHERE id IN (SELECT userId FROM accessTokens WHERE accessToken = '${accessToken}')`
    const user = await DB.runQuery(selectUser)

    if (!user) {
      this.errorService.unauthorized('User not authorized.')
    }

    const updateProfile = `UPDATE users SET firstName = '${firstName}', lastName = '${lastName}', gender = '${gender}' WHERE id = ${user[0].id}`
    await DB.runQuery(updateProfile)

    if (newPassword && oldPassword) {
      if (!this.authController.comparePassword(oldPassword, user[0].password)) {
        this.errorService.badRequest('Incorrect old password.')
      }

      const hashedPassword = await this.authController.getHashedPassword(newPassword)

      const updateUserPassword = `UPDATE users SET password = '${hashedPassword}' WHERE id = ${user[0].id}`
      await DB.runQuery(updateUserPassword)
    }

    const selectUpdatedProfile = `SELECT * FROM users WHERE id = ${user[0].id}`
    const updatedProfile = await DB.runQuery(selectUpdatedProfile)

    return updatedProfile[0]
  }

  async deleteAccount(accessToken: string, DB: any): Promise<void> {
    const selectUser = `SELECT * FROM users WHERE id IN (SELECT userId FROM accessTokens WHERE accessToken = '${accessToken}')`
    const user = await DB.runQuery(selectUser)

    if (!user) {
      this.errorService.unauthorized('User not authorized.')
    }

    const deleteAccount = `DELETE FROM users WHERE id = ${user[0].id}`
    await DB.runQuery(deleteAccount)

    const deleteAccessToken = `DELETE FROM accessTokens WHERE userId = ${user[0].id}`
    await DB.runQuery(deleteAccessToken)
  }
}
