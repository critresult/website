import { observable } from 'mobx'
import axios from 'axios'
import PromoterStore from './promoter'
import uniqby from 'lodash.uniqby'
import { Race, raceStore } from './race'
import { Entry } from './entry'
import { Series, seriesStore } from './series'

export interface Event {
  _id: string
  name: string
  startDate: string
  endDate: string
  races?: Race[]
  seriesId: string
  series?: Series
}

export default class EventStore {
  @observable homeEvents: Event[] = []
  @observable _eventsById: {
    [key: string]: Event
  } = {}
  @observable _entriesByEventId: {
    [key: string]: Entry[]
  } = {}
  @observable _racesByEventId: {
    [key: string]: Race[]
  } = {}

  racesByEventId(id: string): Race[] {
    if (!this._racesByEventId[id]) {
      this._racesByEventId[id] = []
    }
    return this._racesByEventId[id]
  }

  eventsById(id: string): Event {
    return this._eventsById[id] || ({} as Event)
  }

  entriesByEventId(id: string): Entry[] {
    if (!this._entriesByEventId[id]) {
      this._entriesByEventId[id] = []
    }
    return this._entriesByEventId[id]
  }

  async load(_id: string) {
    try {
      const { data } = await axios.get('/events', {
        params: {
          token: PromoterStore.activeToken(),
          _id,
        },
      })
      this._eventsById[_id] = data
    } catch (err) {
      console.log('Error loading event by id', err)
      throw err
    }
  }

  async loadRacesByEventId(id: string) {
    try {
      const { data } = await axios.get('/races', {
        params: {
          eventId: id,
          token: PromoterStore.activeToken(),
        },
      })
      data.forEach((race: Race) => {
        raceStore._racesById[race._id] = race
      })
      this._racesByEventId[id] = data
    } catch (err) {
      console.log('Error loading races by event id', err)
      throw err
    }
  }

  async loadEntries(_id: string) {
    try {
      const { data } = await axios.get('/events/entries', {
        params: {
          _id,
          token: PromoterStore.activeToken(),
        },
      })
      this._entriesByEventId[_id] = data
    } catch (err) {
      console.log('Error loading entries', err)
      throw err
    }
  }

  async delete(_id: string) {
    try {
      await axios.delete('/events', {
        data: { _id, token: PromoterStore.activeToken() },
      })
    } catch (err) {
      console.log('Error deleting event by id', err)
      throw err
    }
  }

  async create(eventData: Event) {
    try {
      const { data } = await axios.post('/events', {
        ...eventData,
        token: PromoterStore.activeToken(),
      })
      this._eventsById[data._id] = data
      return data
    } catch (err) {
      console.log('Error creating event', err)
      throw err
    }
  }

  async loadHome() {
    try {
      const { data } = await axios.get('/events/home', {
        params: {
          token: PromoterStore.activeToken(),
        },
      })
      const redundantEvents = [...this.homeEvents, ...data]
      this.homeEvents = uniqby(redundantEvents, '_id')
      this.homeEvents.forEach((event) => {
        seriesStore._seriesById[event.seriesId] = event.series
        this._eventsById[event._id] = event
        this._racesByEventId[event._id] = event.races
      })
    } catch (err) {
      console.log('Error loading upcoming events', err)
      throw err
    }
  }
}

export const eventStore = new EventStore()
