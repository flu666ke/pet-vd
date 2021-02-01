import { Message } from 'src/models/message'

export interface ICreateChat {
  userIds: Array<number>
}

export interface ICreatedChat {
  chatId: number
  messages: Message[]
}

export interface IChatMessage {
  id: number
  chatId: number
  senderId: number
}
