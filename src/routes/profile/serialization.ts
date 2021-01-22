import { User } from 'src/models/user'

export default function serializeProfile(profile: User): any {
  const { firstName, lastName, gender } = profile

  return {
    firstName,
    lastName,
    gender: gender ? gender : null
  }
}
