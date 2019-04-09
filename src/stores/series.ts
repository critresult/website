import { observable } from 'mobx'
import axios from 'axios'
import PromoterStore, { Promoter } from './promoter'
import uniqby from 'lodash.uniqby'

export interface Series {
  _id: string
  name: string
  promoterId: string
}

export default class SeriesStore {
  @observable all: Series[] = []
  @observable mySeries: Series[] = []
  @observable _seriesById: {
    [key: string]: Series
  } = {}
  @observable _promotersBySeriesId: {
    [key: string]: Promoter[]
  } = {}

  seriesById(id: string): Series {
    return this._seriesById[id] || ({} as Series)
  }

  promotersBySeriesId(id: string): Promoter[] {
    return this._promotersBySeriesId[id] || []
  }

  async loadPromoters(seriesId: string) {
    try {
      const { data } = await axios.get('/series/promoters', {
        params: {
          seriesId,
          token: PromoterStore.activeToken(),
        },
      })
      this._promotersBySeriesId[seriesId] = data
    } catch (err) {
      console.log('Error loading promoters for series', err)
      throw err
    }
  }

  async load(_id?: string) {
    try {
      const { data } = await axios.get('/series', {
        params: {
          ...(_id ? { _id } : {}),
          token: PromoterStore.activeToken(),
        },
      })
      if (_id) {
        this.all.push(data)
      } else {
        this.all.push(...data)
      }
      this.all = uniqby(this.all, '_id')
      this.all.forEach((series) => (this._seriesById[series._id] = series))
    } catch (err) {
      console.log('Error loading rider by id', err)
      throw err
    }
  }

  async loadMySeries() {
    try {
      const { data } = await axios.get('/series/authenticated', {
        params: {
          token: PromoterStore.activeToken(),
        },
      })
      this.mySeries = data
    } catch (err) {
      console.log('Error loading owned series', err)
      throw err
    }
  }

  async create(seriesData: any) {
    try {
      const { data } = await axios.post('/series', {
        ...seriesData,
        token: PromoterStore.activeToken(),
      })
      this._seriesById[data._id] = data
    } catch (err) {
      console.log('Error creating series', err)
      throw err
    }
  }

  async invitePromoter(seriesId: string, email: string) {
    try {
      await axios.post('/series/invite', {
        token: PromoterStore.activeToken(),
        email,
        seriesId,
      })
    } catch (err) {
      console.log('Error inviting promoter', err)
      throw err
    }
  }
}
