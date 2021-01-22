import { action, makeObservable, observable } from 'mobx'
import { RootStore } from './RootStore'

export type ErrorHydration = {
  message: string
  httpStatus?: number
  code?: string
}

export class ErrorStore {
  root: RootStore
  error: null | ErrorHydration | undefined

  constructor(root: RootStore) {
    this.root = root

    makeObservable(this, {
      hydrate: action,
      clearError: action,
      setError: action,
      error: observable
    })
  }

  setError = (error: ErrorHydration) => {
    this.error = error
  }

  clearError = () => {
    this.error = null
  }

  hydrate(error?: ErrorHydration) {
    if (error) {
      console.log('ErrorStore -- hydrate -- ', this.error)
      this.error = error
    }
  }
}
