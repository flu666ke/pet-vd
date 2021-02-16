import { Profile } from 'src/models/profile'
import { Voting } from 'src/models/voting'
import { IUpdateProfile } from '../../interfaces/updateProfile'

export function serializeVoting(voting: Voting): Voting {
  const {
    id,
    creatorId,
    title,
    expirationDate,
    allVotes,
    option1,
    numbersOpt1 = null,
    option2,
    numbersOpt2 = null,
    option3 = undefined,
    numbersOpt3 = null,
    option4 = undefined,
    numbersOpt4 = null
  } = voting
  return {
    id,
    creatorId,
    title,
    allVotes: allVotes ? allVotes : 0,
    expirationDate,
    option1,
    numbersOpt1: numbersOpt1 ? numbersOpt1 : 0,
    option2,
    numbersOpt2: numbersOpt2 ? numbersOpt2 : 0,
    option3,
    numbersOpt3: numbersOpt3 ? numbersOpt3 : 0,
    option4,
    numbersOpt4: numbersOpt4 ? numbersOpt4 : 0
  }
}

export function serializeAllVoting(allVoting: Voting[]) {
  return allVoting.map(voting => serializeVoting(voting))
}
