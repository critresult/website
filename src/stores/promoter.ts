import { computed, observable, action, runInAction } from 'mobx'
import axios from 'axios'
import Hydrated from './hydrated'

export interface Promoter {
  _id: string
  createdAt: string
  email: string
}

export default class PromoterStore extends Hydrated {
  @observable userId: string
  @observable promotersById: {
    [key: string]: Promoter
  }

  constructor() {
    super()
    this.promotersById = {}
    const active = JSON.parse(localStorage.getItem('promoter'))
    if (active) {
      this.userId = active._id
      this.promotersById[active._id] = active
    }
    if (this.authenticated) {
      this.loadPromoter().catch(() => {})
    }
  }

  async hydrate() {}

  @computed
  get active() {
    return this.promotersById[this.userId] || {}
  }

  @computed
  get authenticated() {
    return !!this.userId
  }

  get token() {
    return localStorage.getItem('token')
  }

  static activeToken() {
    return localStorage.getItem('token')
  }

  /**
   * Call with arguments to filter, otherwise retrieve own profile
   **/
  async loadPromoter(_id?: string) {
    try {
      const { data } = await axios.get('/promoters', {
        params: {
          _id,
          token: this.token,
        },
      })
      runInAction(() => {
        this.promotersById[data._id] = data
      })
    } catch (err) {
      console.log(err.response.data.message)
      throw err
    }
  }

  async signup(email: string, password: string) {
    try {
      const { data } = await axios.post('/promoters', {
        email,
        password,
      })
      runInAction(() => {
        localStorage.setItem('token', data.token)
        localStorage.setItem('promoter', JSON.stringify(data))
        this.promotersById[data._id] = data
        this.userId = data._id
      })
    } catch (err) {
      console.log(err.response.data.message)
      throw err
    }
  }

  async login(email: string, password: string) {
    try {
      const { data } = await axios.post('/promoters/login', {
        email,
        password,
      })
      runInAction(() => {
        localStorage.setItem('token', data.token)
        localStorage.setItem('promoter', JSON.stringify(data))
        this.promotersById[data._id] = data
        this.userId = data._id
      })
    } catch (err) {
      console.log(err.response.data.message)
      throw err
    }
  }

  @action
  logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('promoter')
    this.userId = ''
  }
}
