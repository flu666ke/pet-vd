import { UserHydration, UserStore } from './UserStore'
import { ErrorHydration, ErrorStore } from './ErrorStore'
import { NoticeHydration, NoticeStore } from './NoticeStore'

export type HydrationData = {
  error?: ErrorHydration
  notice?: NoticeHydration
  user?: UserHydration
}

export class RootStore {
  errorStore: ErrorStore
  userStore: UserStore
  noticeStore: NoticeStore

  constructor() {
    this.errorStore = new ErrorStore(this)
    this.userStore = new UserStore(this)
    this.noticeStore = new NoticeStore(this)
  }

  hydrate(data: HydrationData) {
    if (data.error) {
      this.errorStore.hydrate(data.error)
    } else if (data.user) {
      this.userStore.hydrate(data.user)
    } else if (data.notice) {
      this.noticeStore.hydrate(data.notice)
    }
  }
}
