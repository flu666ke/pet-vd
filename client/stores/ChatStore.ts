import { action, makeObservable, observable } from 'mobx'
import { RootStore } from './RootStore'

export type MessageHydration = {
  id?: number
  userId?: number
  sender: string
  text: string
  sentAt?: Date
}

export type ChatHydration = {
  chatId?: number
  messages: MessageHydration[]
}

export class ChatStore {
  root: RootStore
  chat: null | ChatHydration | undefined

  constructor(root: RootStore) {
    this.root = root

    makeObservable(this, {
      hydrate: action,
      setChatToStore: action,
      chat: observable
    })
  }

  setChatToStore = (chat: ChatHydration) => {
    this.chat = chat
  }

  hydrate(chat: ChatHydration) {
    if (chat) {
      this.chat = chat
    }
  }
}
