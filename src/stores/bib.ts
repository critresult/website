import { observable } from 'mobx'
import axios from 'axios'
import PromoterStore from './promoter'
import Hydrated from './hydrated'
import keyby from 'lodash.keyby'

export interface Bib {
  _id: string
}

export default class BibStore extends Hydrated {
  @observable bibsBySeriesId: {
    [key: string]: Bib[]
  } = {}

  async hydrate() {
    const { data } = await axios.get('/bibs', {
      params: {
        token: PromoterStore.activeToken(),
      },
    })
    this.bibsBySeriesId = {}
    data.forEach((bib) => {
      this.bibsBySeriesId[bib.seriesId] =
        this.bibsBySeriesId[bib.seriesId] || []
      this.bibsBySeriesId[bib.seriesId].push(bib)
    })
  }

  async loadBibsForSeries(seriesId: string) {
    try {
      const { data } = await axios.get('/bibs', {
        params: {
          seriesId,
          token: PromoterStore.activeToken(),
        },
      })
      this.bibsBySeriesId[seriesId] = data
    } catch (err) {
      console.log('Error loading bibs for series', err)
      throw err
    }
  }

  async create(bibData: any) {
    try {
      const { data } = await axios.post('/bibs', {
        ...bibData,
        token: PromoterStore.activeToken(),
      })
      return data
    } catch (err) {
      console.log('Error creating bib', err)
      throw err
    }
  }

  async delete(_id: string) {
    try {
      await axios.delete('/bibs', {
        data: {
          _id,
          token: PromoterStore.activeToken(),
        },
      })
    } catch (err) {
      console.log('Error deleting bib', err)
      throw err
    }
  }
}
