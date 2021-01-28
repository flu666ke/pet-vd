import ErrorService from 'src/module.error/errorService'
import { DataBase } from 'src/db'

export default class ChatController {
  private errorService: ErrorService

  constructor(errorService: ErrorService) {
    this.errorService = errorService
  }

  async sendMessage(DB: DataBase) {
    return 'OK'
  }
}
