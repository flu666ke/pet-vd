import { action, makeObservable, observable } from 'mobx'
import { RootStore } from './RootStore'

export type ProfileHydration = {
  userId: number
  firstName: string
  lastName: string
  gender?: string
}

export class ProfileStore {
  root: RootStore
  profile: null | ProfileHydration | undefined
  profiles: null | ProfileHydration[] | undefined

  constructor(root: RootStore) {
    this.root = root

    makeObservable(this, {
      hydrate: action,
      removeProfile: action,
      profile: observable,
      profiles: observable
    })
  }

  removeProfile = () => {
    this.profile = null
    this.profiles = null
  }

  hydrate(profile?: ProfileHydration, profiles?: ProfileHydration[]) {
    if (profile) {
      this.profile = profile
    }
    if (profiles) {
      this.profiles = profiles
    }
  }
}
