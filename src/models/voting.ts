export interface Voting {
  id?: number
  creatorId: number
  title: string
  expirationDate: Date
  option1: string
  numbersOpt1?: number
  option2: string
  numbersOpt2?: number
  option3?: string
  numbersOpt3?: number
  option4?: string
  numbersOpt4?: number
  allVotes: number
  createdAt?: Date
  updatedAt?: Date
}
