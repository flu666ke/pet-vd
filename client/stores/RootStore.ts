import { ProfileHydration, ProfileStore } from './ProfileStore'
import { ErrorHydration, ErrorStore } from './ErrorStore'
import { NoticeHydration, NoticeStore } from './NoticeStore'
import { ChatStore } from './ChatStore'

export type HydrationData = {
  error?: ErrorHydration
  notice?: NoticeHydration
  profile?: ProfileHydration
  profiles?: ProfileHydration[]
}

export class RootStore {
  errorStore: ErrorStore
  profileStore: ProfileStore
  noticeStore: NoticeStore
  chatStore: ChatStore

  constructor() {
    this.errorStore = new ErrorStore(this)
    this.profileStore = new ProfileStore(this)
    this.noticeStore = new NoticeStore(this)
    this.chatStore = new ChatStore(this)
  }

  hydrate(data: HydrationData) {
    if (data.error) {
      this.errorStore.hydrate(data.error)
    }
    if (data.profile) {
      this.profileStore.hydrate(data.profile)
    }
    if (data.profiles) {
      this.profileStore.hydrate(undefined, data.profiles)
    }
    if (data.notice) {
      this.noticeStore.hydrate(data.notice)
    }
  }
}
