import { observable } from 'mobx'
import axios from 'axios'

export interface Race {
  _id: string
  name: string
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
}
