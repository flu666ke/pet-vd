import { action, makeObservable, observable } from 'mobx'
import { RootStore } from './RootStore'

export type MessageHydration = {
  chatId?: number | null
  senderId?: number | null
  // name: string
  text: string
  sentAt?: Date
}

export type ChatHydration = {
  chatId?: number
  senderId: number
  firstName: string
  text: string
}

export class ProfileStore {
  root: RootStore
  chat: null | ChatHydration | undefined

  constructor(root: RootStore) {
    this.root = root

    makeObservable(this, {
      hydrate: action,
      chat: observable
    })
  }

  hydrate(chat: ChatHydration) {
    if (chat) {
      this.chat = chat
    }
  }
}
