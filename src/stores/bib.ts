import { toJS, observable } from 'mobx'
import axios from 'axios'
import PromoterStore from './promoter'
import { riderStore } from './rider'

export interface Bib {
  _id: string
  seriesId: string
  riderId: string
  bibNumber: number
  hasRentalTransponder?: boolean
  rider?: any
}

export default class BibStore {
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
      const keyedRiders = toJS(riderStore._ridersById)
      const keyedBibs = toJS(this._bibsById)
      data.forEach((bib: Bib) => {
        keyedBibs[bib._id] = bib
        if (bib.rider) {
          keyedRiders[bib.rider._id] = bib.rider
        }
      })
      riderStore._ridersById = keyedRiders
      this._bibsById = keyedBibs
      this._bibsBySeriesId[seriesId] = data
    } catch (err) {
      console.log('Error loading bibs for series', err)
      throw err
    }
  }

  async loadIfNeeded(_id: string) {
    if (this._bibsById[_id] && this._bibsById[_id]._id) return
    await this.loadById(_id)
  }

  async loadById(_id: string) {
    try {
      const { data } = await axios.get('/bibs', {
        params: {
          _id,
          token: PromoterStore.activeToken(),
        },
      })
      this._bibsById[_id] = data
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
