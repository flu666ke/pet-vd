import { User } from '../models/user'
import ErrorService from 'src/module.error/errorService'

export default class ProfileController {
  private errorService: ErrorService

  constructor(errorService: ErrorService) {
    this.errorService = errorService
  }

  async getProfile(accessToken: string, DB: any): Promise<User> {
    const selectUser = `SELECT * FROM users WHERE id IN (SELECT userId FROM accessTokens WHERE accessToken = '${accessToken}')`
    const user = await DB.runQuery(selectUser)

    if (!user) {
      this.errorService.unauthorized('User not authorized.')
    }

    return user[0]
  }

  async updateProfile(accessToken: string, DB: any): Promise<User> {
    const selectUser = `SELECT * FROM users WHERE id IN (SELECT userId FROM accessTokens WHERE accessToken = '${accessToken}')`
    const user = await DB.runQuery(selectUser)

    if (!user) {
      this.errorService.unauthorized('User not authorized.')
    }

    return user[0]
  }
}
