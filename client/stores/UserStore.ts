import { action, makeObservable, observable } from 'mobx'
import { RootStore } from './RootStore'

export type UserHydration = {
  firstName: string
  lastName: string
  gender?: string
}

export class UserStore {
  root: RootStore
  user: null | UserHydration | undefined

  constructor(root: RootStore) {
    this.root = root

    makeObservable(this, {
      hydrate: action,
      removeUser: action,
      user: observable
    })
  }

  removeUser = () => {
    this.user = null
  }

  hydrate(user?: UserHydration) {
    if (user) {
      this.user = user
    }
  }
}
