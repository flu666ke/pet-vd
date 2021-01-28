import { Profile } from 'src/models/profile'
import { IUpdateProfile } from '../../interfaces/updateProfile'

export function serializeProfile(profile: Profile): IUpdateProfile {
  const {userId, firstName, lastName, gender } = profile

  return {
    userId,
    firstName,
    lastName,
    gender: gender ? gender : null
  }
}

export function serializeProfiles(profiles: Profile[]) {
  return profiles.map(profile => serializeProfile(profile))
}
