import { User } from '../models/user'
import ErrorService from 'src/module.error/errorService'
import AuthController from './auth'
import { IUpdateProfile } from 'src/interfaces/updateProfile'
import { DataBase } from 'src/db'
import { Profile } from 'src/models/profile'

export default class ProfileController {
  private errorService: ErrorService
  private authController: AuthController

  constructor(errorService: ErrorService, authController: AuthController) {
    this.errorService = errorService
    this.authController = authController
  }

  async getProfile(accessToken: string, DB: DataBase): Promise<Profile> {
    const selectUser = `SELECT * FROM users WHERE id IN (SELECT userId FROM accessTokens WHERE accessToken = '${accessToken}')`
    const user: User[] = await DB.runQuery(selectUser)

    if (!user) {
      this.errorService.unauthorized('User not authorized.')
    }

    const selectProfile = `SELECT * FROM profiles WHERE userId = ${user[0].id}`
    const profile: Profile[] = await DB.runQuery(selectProfile)

    return profile[0]
  }

  async updateProfile(profile: IUpdateProfile, accessToken: string, DB: DataBase): Promise<Profile> {
    const { firstName, lastName, gender, newPassword, oldPassword } = profile

    const selectUser = `SELECT * FROM users WHERE id IN (SELECT userId FROM accessTokens WHERE accessToken = '${accessToken}')`
    const user: User[] = await DB.runQuery(selectUser)

    if (!user) {
      this.errorService.unauthorized('User not authorized.')
    }

    const updateProfile = `UPDATE profiles SET firstName = '${firstName}', lastName = '${lastName}', gender = '${gender}' WHERE userId = ${user[0].id}`
    await DB.runQuery(updateProfile)

    if (newPassword && oldPassword) {
      if (!this.authController.comparePassword(oldPassword, user[0].password)) {
        this.errorService.badRequest('Incorrect old password.')
      }

      const hashedPassword = await this.authController.getHashedPassword(newPassword)

      const updateUserPassword = `UPDATE users SET password = '${hashedPassword}' WHERE id = ${user[0].id}`
      await DB.runQuery(updateUserPassword)
    }

    const selectUpdatedProfile = `SELECT * FROM profiles WHERE userId = ${user[0].id}`
    const updatedProfile: Profile[] = await DB.runQuery(selectUpdatedProfile)

    return updatedProfile[0]
  }

  async deleteAccount(accessToken: string, DB: DataBase): Promise<void> {
    const selectUser = `SELECT * FROM users WHERE id IN (SELECT userId FROM accessTokens WHERE accessToken = '${accessToken}')`
    const user: User[] = await DB.runQuery(selectUser)

    if (!user) {
      this.errorService.unauthorized('User not authorized.')
    }

    const deleteAccount = `DELETE FROM users WHERE id = ${user[0].id}`
    await DB.runQuery(deleteAccount)

    const deleteAccessToken = `DELETE FROM accessTokens WHERE userId = ${user[0].id}`
    await DB.runQuery(deleteAccessToken)
  }

  async getAllProfiles(DB: DataBase): Promise<Profile[]> {
    const selectProfiles = `SELECT * FROM profiles WHERE userId IN (SELECT id FROM users WHERE emailVerifiedAt IS NOT NULL)`
    const profiles: Profile[] = await DB.runQuery(selectProfiles)

    return profiles
  }
}
