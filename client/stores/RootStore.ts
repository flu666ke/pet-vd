import { ErrorHydration, ErrorStore } from './ErrorStore'

export type RootStoreHydration = {
  error?: ErrorHydration
}

export class RootStore {
  errorStore: ErrorStore

  constructor() {
    this.errorStore = new ErrorStore(this)
  }

  hydrate(data: RootStoreHydration) {
    if (data.error) {
      this.errorStore.hydrate(data.error)
    }
  }
}
