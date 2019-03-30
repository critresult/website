import { observable } from 'mobx'
import axios from 'axios'
import PromoterStore from './promoter'

export interface Bib {
  _id: string
}

export default class BibStore {
  @observable bibsBySeriesId: {
    [key: string]: Bib[]
  } = {}

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
      await axios.post('/bibs', {
        ...bibData,
        token: PromoterStore.activeToken()
      })
    } catch( err) {
      console.log('Error creating bib', err)
      throw err
    }
  }
}
