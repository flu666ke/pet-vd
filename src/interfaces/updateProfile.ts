export interface IUpdateProfile {
  userId?: number
  firstName?: string
  lastName?: string
  gender?: string | null
  oldPassword?: string
  newPassword?: string
}
