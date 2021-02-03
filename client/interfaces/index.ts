export interface ILoginData {
  email: string
  password: string
}

export interface IRegisterData {
  firstName: string
  lastName: string
  email: string
  password: string
}

export interface IUpdateProfile {
  firstName: string
  lastName: string
  gender?: string
  newPassword?: string
  oldPassword?: string
}

export interface IConfirmAuth {
  activationId: string
}

export interface IUpdatePassword {
  resetPasswordLink: string
  newPassword: string
}
