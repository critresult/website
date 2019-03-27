import { observable } from 'mobx'
import axios from 'axios'

export default class PromoterStore {
  @observable auth: {
    email: string
    token: string
  }

  async signup(email: string, password: string) {
    try {
      const { data } = await axios.post('/promoter', {
        email,
        password,
      })
      console.log(data)
      this.auth = data
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
      this.auth = data
    } catch (err) {
      console.log(err.response.data.message)
      throw err
    }
  }
}
