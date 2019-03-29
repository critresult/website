import { observable } from 'mobx'
import axios from 'axios'
import PromoterStore from './promoter'

export interface Rider {
  _id: string
  firstname: string
  lastname: string
  license: string
}

export default class RiderStore {
  @observable ridersById: {
    [key: string]: Rider
  } = {}

  async load(_id: string) {
    try {
      const { data } = await axios.get('/riders', {
        params: {
          _id,
          token: PromoterStore.activeToken(),
        },
      })
      this.ridersById[_id] = data
    } catch (err) {
      console.log('Error loading rider by id', err)
      throw err
    }
  }

  async search(value: string) {
    try {
      const { data } = await axios.get('/riders/search', {
        params: {
          search: value,
          token: PromoterStore.activeToken(),
        },
      })
      return data
    } catch (err) {
      console.log('Error searching', err)
      throw err
    }
  }

  async create(riderData: any) {
    try {
      const { data } = await axios.post('/riders', {
        ...riderData,
        token: PromoterStore.activeToken(),
      })
      this.ridersById[data._id] = data
    } catch (err) {
      console.log('Error creating rider', err)
      throw err
    }
  }
}
