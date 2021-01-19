import { action, makeObservable, observable } from 'mobx'
import { RootStore } from './RootStore'

export type UserHydration = {
  firstName: string
  lastName: string
}

export class UserStore {
  root: RootStore
  user: null | UserHydration | undefined

  constructor(root: RootStore) {
    this.root = root

    makeObservable(this, {
      hydrate: action,
      user: observable
    })
  }

  hydrate(user?: UserHydration) {
    if (user) {
      this.user = user
    }
  }
}
