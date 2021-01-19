import { UserHydration, UserStore } from './UserStore'
import { ErrorHydration, ErrorStore } from './ErrorStore'

export type HydrationData = {
  error?: ErrorHydration
  user?: UserHydration
}

export class RootStore {
  errorStore: ErrorStore
  userStore: UserStore

  constructor() {
    this.errorStore = new ErrorStore(this)
    this.userStore = new UserStore(this)
  }

  hydrate(data: HydrationData) {
    if (data.error) {
      this.errorStore.hydrate(data.error)
    } else if (data.user) {
      this.userStore.hydrate(data.user)
    }
  }
}
