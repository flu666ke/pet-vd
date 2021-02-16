import ErrorService from 'src/module.error/errorService'
import HelperService from 'src/module.helper/helperService'
import { DataBase } from 'src/db'
import { Voting } from 'src/models/voting'

export default class VotingController {
  private helperService: HelperService
  private errorService: ErrorService

  constructor(helperService: HelperService, errorService: ErrorService) {
    this.helperService = helperService
    this.errorService = errorService
  }

  async createVoting(voting: Voting, DB: DataBase) {
    const { creatorId, title, option1, option2, option3 = null, option4 = null } = voting

    const insertVoting = `INSERT INTO voting(creatorId, title, expirationDate, option1, option2, option3, option4)
     VALUES ('${creatorId}', '${title}', '${this.helperService.getExpirationDate()}', '${option1}', '${option2}', '${option3}', '${option4}')`
    await DB.runQuery(insertVoting)

    return 'OK'
  }

  async getAllVoting(DB: DataBase) {
    const selectAllVoting = `SELECT * FROM voting`
    const allVoting: Voting[] = await DB.runQuery(selectAllVoting)

    return allVoting ? allVoting : []
  }
}
