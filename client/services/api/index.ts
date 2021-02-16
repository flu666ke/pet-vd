import axios from 'axios'
import { IConfirmAuth, ILoginData, IRegisterData, IUpdatePassword, IUpdateProfile } from '../../interfaces'

const instance = axios.create({
  baseURL: 'http://localhost:5000/',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
})

instance.interceptors.response.use(
  res => res,
  err => {
    console.log({ err })

    if (err.response.status === 401) {
      console.log('err.response.status --- ', err.response.status)

      // window.location.href = '/'
    }

    return Promise.reject(err)
  }
)

const API = {
  async getProfile() {
    const { data } = await instance.get('')

    return data
  },
  async getProfiles() {
    const { data } = await instance.get('profiles')

    return data
  },
  async updateProfile(body: IUpdateProfile) {
    const { data } = await instance.patch('update-profile', body)

    return data
  },
  async deleteAccount() {
    const { data } = await instance.delete('delete-account')

    return data
  },
  async signUp(body: IRegisterData) {
    const { data } = await instance.post('signup', body)

    return data
  },
  async confirmAuth(body: IConfirmAuth) {
    const { data } = await instance.post('account-activation', body)

    return data
  },
  async getActivationLink(email: string) {
    const { data } = await instance.post('activation-link', { email })

    return data
  },
  async signIn(body: ILoginData) {
    const { data } = await instance.post('signin', body)

    return data
  },
  async forgotPassword(email: string) {
    const { data } = await instance.post('forgot-password', { email })

    return data
  },
  async restorePassword(body: IUpdatePassword) {
    const { data } = await instance.post('restore-password', body)

    return data
  },
  async logout() {
    const { data } = await instance.delete('logout')

    return data
  },
  async createChat(body: any) {
    const { data } = await instance.post('chat', body)

    return data
  },
  async sendMessage(body: any) {
    const { data } = await instance.post('message', body)

    return data
  },
  async createVoting(body: any) {
    const { data } = await instance.post('voting', body)

    return data
  }
}

export default API
