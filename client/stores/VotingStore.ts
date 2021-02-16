import { action, makeObservable, observable } from 'mobx'
import { RootStore } from './RootStore'

export type VotingHydration = {
  creatorId: number
  title: string
  expirationDate: Date
  allVotes: number
  option1: string
  option2: string
  option3?: string
  option4?: string
  numbersOpt1: number
  numbersOpt2: number
  numbersOpt3?: number
  numbersOpt4?: number
}

export class VotingStore {
  root: RootStore
  voting: null | VotingHydration | undefined
  allVoting: null | VotingHydration[] | undefined

  constructor(root: RootStore) {
    this.root = root

    makeObservable(this, {
      hydrate: action,
      voting: observable,
      allVoting: observable
    })
  }

  hydrate(voting?: VotingHydration, allVoting?: VotingHydration[]) {
    if (voting) {
      this.voting = voting
    }
    if (allVoting) {
      this.allVoting = allVoting
    }
  }
}
