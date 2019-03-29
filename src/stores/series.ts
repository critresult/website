import { observable } from 'mobx'
import axios from 'axios'
import PromoterStore from './promoter'

export interface Series {
  _id: string
  name: string
  promoterId: string
}

export default class SeriesStore {
  @observable mySeries: Series[] = []

  async load() {
    try {
      const { data } = await axios.get('/series', {
        params: {
          token: PromoterStore.activeToken(),
        },
      })
      this.mySeries = data
    } catch (err) {
      console.log('Error loading rider by id', err)
      throw err
    }
  }

  async create(seriesData: any) {
    try {
      await axios.post('/series', {
        ...seriesData,
        token: PromoterStore.activeToken(),
      })
    } catch (err) {
      console.log('Error creating series', err)
      throw err
    }
  }
}
