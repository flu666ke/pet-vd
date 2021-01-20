import axios from 'axios'
import { LoginData, RegisterData } from '../../interfaces'

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
    }

    return Promise.reject(err)
  }
)

const API = {
  async getHomePage() {
    const { data } = await instance.get('')

    return data
  },
  async signUp(body: RegisterData) {
    const { data } = await instance.post('signup', body)

    return data
  },
  async confirmAuth(body: any) {
    const { data } = await instance.post('account-activation', body)

    return data
  },
  async getActivationLink(email: string) {
    const { data } = await instance.post('activation-link', { email })

    return data
  },
  async signIn(body: LoginData) {
    const { data } = await instance.post('signin', body)

    return data
  },
  async forgotPassword(email: string) {
    const { data } = await instance.post('forgot-password', { email })

    return data
  },
  async restorePassword(body: any) {
    const { data } = await instance.post('restore-password', body)

    return data
  }
}

export default API
