import { observable } from 'mobx'
import axios from 'axios'
import PromoterStore from './promoter'
import { Rider } from './rider'

export interface Race {
  _id: string
  name: string
  scheduledStart: string
}

export interface Entry {
  _id: string
  riderId: string
  raceId: string
  bib: string
  race?: Race
  rider?: Rider
}

export default class RaceStore {
  @observable racesById: {
    [key: string]: Race
  } = {}
  @observable entriesByRaceId: {
    [key: string]: Entry[]
  } = {}

  async addRider(raceId: string, riderId: string, bib: string) {
    try {
      await axios.post('/races/entry', {
        raceId,
        riderId,
        bib,
        token: PromoterStore.activeToken(),
      })
    } catch (err) {
      console.log('Error adding rider', err)
      throw err
    }
  }

  async removeRider(raceId: string, riderId: string) {
    try {
      await axios.delete('/races/entries', {
        data: {
          raceId,
          riderId,
          token: PromoterStore.activeToken(),
        },
      })
    } catch (err) {
      console.log('Error removing rider', err)
      throw err
    }
  }

  async loadEntries(_id: string) {
    try {
      const { data } = await axios.get('/races/entries', {
        params: {
          _id,
          token: PromoterStore.activeToken(),
        },
      })
      this.entriesByRaceId[_id] = data
    } catch (err) {
      console.log('Error loading entries', err)
      throw err
    }
  }

  async load(_id: string) {
    try {
      const { data } = await axios.get('/races', {
        params: {
          _id,
          token: PromoterStore.activeToken(),
        },
      })
      this.racesById[_id] = data
    } catch (err) {
      console.log('Error loading races by id', err)
      throw err
    }
  }

  async loadByEventId(eventId: string) {
    try {
      const { data } = await axios.get('/races', {
        params: {
          eventId,
          token: PromoterStore.activeToken(),
        },
      })
      data.forEach((race: Race) => {
        this.racesById[race._id] = race
      })
    } catch (err) {
      console.log('Error loading races by event id', err)
      throw err
    }
  }

  async create(raceData: any) {
    try {
      const { data } = await axios.post('/races', {
        ...raceData,
        token: PromoterStore.activeToken(),
      })
      this.racesById[data._id] = data
    } catch (err) {
      console.log('Error creating race', err)
      throw err
    }
  }
}
