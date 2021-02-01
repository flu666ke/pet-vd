import ErrorService from 'src/module.error/errorService'
import { DataBase } from 'src/db'
import { Message } from 'src/models/message'
import HelperService from 'src/module.helper/helperService'
import { ICreateChat } from 'src/interfaces/createChat'

export default class ChatController {
  private helperService: HelperService
  private errorService: ErrorService

  constructor(helperService: HelperService, errorService: ErrorService) {
    this.helperService = helperService
    this.errorService = errorService
  }

  async createChat(chat: ICreateChat, DB: DataBase) {
    const oneToOneKey = chat.userIds.sort().join('-')

    const selectChat = `SELECT * FROM chats WHERE oneToOneKey = '${oneToOneKey}'`
    const selectedChat = await DB.runQuery(selectChat)

    if (selectedChat) {
      const selectMessages = `SELECT m.id, m.chatId, m.senderId, m.text, m.sentAt, p.firstName
      FROM messages AS m
      INNER JOIN profiles AS p ON m.senderId = p.userId
      WHERE chatId = '${selectedChat[0].id}' ORDER BY sentAt ASC`
      const messages: Message[] = await DB.runQuery(selectMessages)

      return { chatId: selectedChat[0].id, messages }
    }

    const insertChat = `INSERT INTO chats (oneToOneKey) VALUES ('${oneToOneKey}')`
    const createdChat = await DB.runQuery(insertChat)

    return { chatId: createdChat.insertId, messages: [] }
  }

  async sendMessage(message: Message, DB: DataBase) {
    const { chatId, senderId, text, sentAt } = message

    const insertMessage = `INSERT INTO messages(chatId, senderId, text, sentAt) VALUES (${chatId}, '${senderId}', '${text}', '${this.helperService.getFormattedDate(
      sentAt
    )}')`
    await DB.runQuery(insertMessage)

    const insertChatParticipants = `INSERT INTO chatParticipants(chatId, userId) VALUES (${chatId}, '${senderId}')`
    await DB.runQuery(insertChatParticipants)

    return 'OK'
  }
}
