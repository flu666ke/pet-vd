import { ICreatedChat } from 'src/interfaces/createChat'
import { Message } from 'src/models/message'

export function serializeChat(chat: ICreatedChat) {
  const { chatId, messages } = chat

  return {
    chatId,
    messages: serializeMessages(messages)
  }
}

export function serializeMessage(message: Message) {
  const { id, senderId, text, sentAt, firstName } = message

  return {
    id,
    senderId,
    sender: firstName,
    text,
    sentAt
  }
}

export function serializeMessages(messages: Message[]) {
  return messages.map((message: Message) => serializeMessage(message))
}
