import { observable, computed } from 'mobx'
import axios from 'axios'

interface Promoter {
  _id: string
  createdAt: string
  email: string
}

export default class PromoterStore {
  @observable active: Promoter

  get authenticated() {
    return !!this.token
  }

  @computed
  get token() {
    return localStorage.getItem('token')
  }

  @computed
  static token() {
    return localStorage.getItem('token')
  }

  async signup(email: string, password: string) {
    try {
      const { data } = await axios.post('/promoter', {
        email,
        password,
      })
      localStorage.setItem('token', data.token)
      this.active = data
    } catch (err) {
      console.log(err.response.data.message)
      throw err
    }
  }

  async login(email: string, password: string) {
    try {
      const { data } = await axios.post('/promoter/login', {
        email,
        password,
      })
      localStorage.setItem('token', data.token)
      this.active = data
    } catch (err) {
      console.log(err.response.data.message)
      throw err
    }
  }
}
