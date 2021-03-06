import { observable } from 'mobx'
import axios from 'axios'
import PromoterStore from './promoter'
import { Entry } from './entry'
import { Passing } from './passing'

export interface Race {
  _id: string
  name: string
  scheduledStartTime: string
  seriesId: string
  eventId: string
  actualStart?: string
  lapCount?: number
  category: string
  gender: 'M' | 'F' | 'All'
}

export interface Leaderboard {
  isFinished: boolean
  leaderFinishTime?: Date
  emptyPassings: Passing[]
  passings: (Passing & {
    lapCount: number
    secondsDiff?: number
  })[]
}

export default class RaceStore {
  @observable _racesById: {
    [key: string]: Race
  } = {}
  @observable _entriesByRaceId: {
    [key: string]: Entry[]
  } = {}
  @observable _leaderboardByRaceId: {
    [key: string]: Leaderboard
  } = {}

  leaderboardByRaceId(id: string) {
    return (
      this._leaderboardByRaceId[id] || {
        isFinished: true,
        passings: [],
      }
    )
  }

  racesById(id: string): Race {
    return this._racesById[id] || ({} as Race)
  }

  entriesByRaceId(id: string): Entry[] {
    return this._entriesByRaceId[id] || []
  }

  async loadLeaderboard(raceId: string) {
    try {
      const { data } = await axios.get('/races/leaderboard', {
        params: {
          raceId,
          token: PromoterStore.activeToken(),
        },
      })
      this._leaderboardByRaceId[raceId] = data
    } catch (err) {
      console.log('Error loading leaderboard for raceId', raceId, err)
      throw err
    }
  }

  async addEntry(raceId: string, riderId: string, bibId: string) {
    try {
      const { data } = await axios.post('/races/entry', {
        raceId,
        riderId,
        bibId,
        token: PromoterStore.activeToken(),
      })
      this._entriesByRaceId[raceId] = this._entriesByRaceId[raceId] || []
      this._entriesByRaceId[raceId].push(data)
    } catch (err) {
      console.log('Error adding rider', err)
      throw err
    }
  }

  async removeEntry(raceId: string, riderId: string) {
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
      const [{ data }] = await Promise.all([
        axios.get('/races/entries', {
          params: {
            _id,
            token: PromoterStore.activeToken(),
          },
        }),
        this.load(_id),
      ])
      this._entriesByRaceId[_id] = data
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
      this._racesById[_id] = data
    } catch (err) {
      console.log('Error loading races by id', err)
      throw err
    }
  }

  async create(raceData: any) {
    try {
      const { data } = await axios.post('/races', {
        ...raceData,
        token: PromoterStore.activeToken(),
      })
      this._racesById[data._id] = data
    } catch (err) {
      console.log('Error creating race', err)
      throw err
    }
  }

  async delete(_id: string) {
    try {
      await axios.delete('/races', {
        data: {
          _id,
          token: PromoterStore.activeToken(),
        },
      })
    } catch (err) {
      console.log('Error deleting race', err)
      throw err
    }
  }

  async update(_id: string, changes = {}) {
    try {
      await axios.put('/races', {
        token: PromoterStore.activeToken(),
        _id,
        changes,
      })
    } catch (err) {
      console.log('Error updating race', err)
      throw err
    }
  }
}

export const raceStore = new RaceStore()
