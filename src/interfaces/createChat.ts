import { Message } from 'src/models/message'

export interface ICreateChat {
  oneToOneKey: string
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
