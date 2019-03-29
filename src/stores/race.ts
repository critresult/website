import { observable } from 'mobx'
import axios from 'axios'
import PromoterStore from './promoter'

export interface Race {
  _id: string
  name: string
  scheduledStart: string
}

export default class RaceStore {
  @observable racesById: {
    [key: string]: Race
  } = {}

  async racesByEventId(eventId: string) {
    try {
      const { data } = await axios.get('/events/races', {
        params: {
          eventId,
        },
      })
      this.racesById[data._id] = data
    } catch (err) {
      console.log('Error loading races by event id', err)
      throw err
    }
  }

  async create(raceData: any) {
    try {
      console.log(raceData)
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
