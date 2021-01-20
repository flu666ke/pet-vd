import { action, makeObservable, observable } from 'mobx'
import { RootStore } from './RootStore'

export type ErrorHydration = string

export class ErrorStore {
  root: RootStore
  error: null | string | undefined

  constructor(root: RootStore) {
    this.root = root

    makeObservable(this, {
      hydrate: action,
      clearMessage: action,
      setError: action,
      error: observable
    })
  }

  setError = (error: string) => {
    this.error = null
  }

  clearMessage = () => {
    this.error = null
  }

  hydrate(error?: ErrorHydration) {
    if (error) {
      console.log('ErrorStore -- hydrate -- ', this.error)
      this.error = error
    }
  }
}
