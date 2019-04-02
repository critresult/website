import { observable } from 'mobx'
import axios from 'axios'
import PromoterStore from './promoter'
import Hydrated from 'hydrated'
import groupby from 'lodash.groupby'
import keyby from 'lodash.keyby'

export interface Bib {
  _id: string
  seriesId: string
  riderId: string
  bibNumber: number
  hasRentalTransponder?: boolean
}

export default class BibStore implements Hydrated {
  @observable bibsBySeriesId: {
    [key: string]: Bib[]
  } = {}
  @observable bibsByRiderId: {
    [key: string]: Bib[]
  } = {}
  @observable bibsById: {
    [key: string]: Bib
  } = {}

  async hydrate() {
    const { data } = await axios.get('/bibs', {
      params: {
        token: PromoterStore.activeToken(),
      },
    })
    this.bibsById = keyby(data, '_id')
    this.bibsBySeriesId = groupby(data, 'seriesId')
    this.bibsByRiderId = groupby(data, 'riderId')
  }

  availableBibsForSeriesId(seriesId: string) {
    const bibs = this.bibsBySeriesId[seriesId] || []
    const bibNumbers = bibs.map((bib) => +bib.bibNumber)
    bibNumbers.sort((b1, b2) => b1 - b2)
    const available = []
    let lastNumber = 0
    for (const num of bibNumbers) {
      if (num - lastNumber === 1) {
        lastNumber = num
        continue
      }
      for (let x = 1; x < num - lastNumber; x++) {
        available.push(lastNumber + x)
      }
      lastNumber = num
    }
    return available
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

  async loadById(_id: string) {
    try {
      const { data } = await axios.get('/bibs', {
        params: {
          _id,
          token: PromoterStore.activeToken(),
        },
      })
      this.bibsById[data._id] = data
    } catch (err) {
      console.log('Error loading bib by id', err)
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

  async update(where: string | object, changes: any) {
    try {
      await axios.put('/bibs', {
        where: typeof where === 'string' ? { _id: where } : where,
        changes,
        token: PromoterStore.activeToken(),
      })
    } catch (err) {
      console.log('Error updating document', err)
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
