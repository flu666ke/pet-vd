export interface Message {
  id: number
  uuid: string
  chatId: number
  senderId: number
  text: string
  sentAt: Date
  firstName: string
}
