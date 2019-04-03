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
  @observable _bibsBySeriesId: {
    [key: string]: Bib[]
  } = {}
  @observable _bibsById: {
    [key: string]: Bib
  } = {}

  bibsBySeriesId(id: string): Bib[] {
    return this._bibsBySeriesId[id] || []
  }

  bibsById(id: string): Bib {
    return this._bibsById[id] || ({} as Bib)
  }

  async hydrate() {
    const { data } = await axios.get('/bibs', {
      params: {
        token: PromoterStore.activeToken(),
      },
    })
    this._bibsById = keyby(data, '_id')
    this._bibsBySeriesId = groupby(data, 'seriesId')
  }

  availableBibsForSeriesId(seriesId: string) {
    const bibs = this.bibsBySeriesId(seriesId)
    const bibNumbers = bibs.map((bib) => +bib.bibNumber)
    bibNumbers.sort((b1, b2) => b1 - b2)
    const available = []
    let lastNumber = 0
    for (const num of bibNumbers) {
      if (num - lastNumber === 1) {
        lastNumber = num
        continue
      }
      for (let x = 1; x < num - lastNumber; x += 1) {
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
      this._bibsBySeriesId[seriesId] = data
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
      this._bibsById[data._id] = data
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
