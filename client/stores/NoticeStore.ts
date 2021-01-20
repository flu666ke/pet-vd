import { action, makeObservable, observable } from 'mobx'
import { RootStore } from './RootStore'

export type NoticeHydration = string

export class NoticeStore {
  root: RootStore
  notice: null | string | undefined

  constructor(root: RootStore) {
    this.root = root

    makeObservable(this, {
      hydrate: action,
      clearNotice: action,
      setNotice: action,
      notice: observable
    })
  }

  setNotice = (notice: string) => {
    this.notice = notice
  }

  clearNotice = () => {
    this.notice = null
  }

  hydrate(notice?: NoticeHydration) {
    if (notice) {
      console.log('ErrorStore -- hydrate -- ', this.notice)
      this.notice = notice
    }
  }
}
