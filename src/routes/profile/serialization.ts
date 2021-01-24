import { User } from 'src/models/user'
import { IUpdateProfile } from '../../interfaces/updateProfile'

export default function serializeProfile(profile: User): IUpdateProfile {
  const { firstName, lastName, gender } = profile

  return {
    firstName,
    lastName,
    gender: gender ? gender : null
  }
}
