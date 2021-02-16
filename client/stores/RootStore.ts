import { ProfileHydration, ProfileStore } from './ProfileStore'
import { ErrorHydration, ErrorStore } from './ErrorStore'
import { NoticeHydration, NoticeStore } from './NoticeStore'
import { ChatStore } from './ChatStore'
import { VotingHydration, VotingStore } from './VotingStore'

export type HydrationData = {
  error?: ErrorHydration
  notice?: NoticeHydration
  profile?: ProfileHydration
  profiles?: ProfileHydration[]
  voting?: VotingHydration
  allVoting?: VotingHydration[]
}

export class RootStore {
  errorStore: ErrorStore
  profileStore: ProfileStore
  noticeStore: NoticeStore
  chatStore: ChatStore
  votingStore: VotingStore

  constructor() {
    this.errorStore = new ErrorStore(this)
    this.profileStore = new ProfileStore(this)
    this.noticeStore = new NoticeStore(this)
    this.chatStore = new ChatStore(this)
    this.votingStore = new VotingStore(this)
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
    if (data.voting) {
      this.votingStore.hydrate(data.voting)
    }
    if (data.allVoting) {
      this.votingStore.hydrate(undefined, data.allVoting)
    }
  }
}
