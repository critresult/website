import { observable } from 'mobx'
import axios from 'axios'
import PromoterStore from './promoter'
import uniqBy from 'lodash.uniqby'
import { Race } from './race'
import { Entry } from './entry'
import groupby from 'lodash.groupby'

export interface Event {
  _id: string
  name: string
  startDate: string
  endDate: string
  races?: Race[]
  seriesId: string
}

export default class EventStore {
  @observable upcomingEvents: Event[] = []
  @observable _eventsBySeriesId: {
    [key: string]: Event[]
  } = {}
  @observable _eventsById: {
    [key: string]: Event
  } = {}
  @observable _entriesByEventId: {
    [key: string]: Entry[]
  } = {}

  eventsBySeriesId(id: string): Event[] {
    return this._eventsBySeriesId[id] || []
  }

  eventsById(id: string): Event {
    return this._eventsById[id] || ({} as Event)
  }

  entriesByEventId(id: string): Entry[] {
    return this._entriesByEventId[id] || []
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

  async loadUpcoming() {
    try {
      const { data } = await axios.get('/events/upcoming', {
        params: {
          token: PromoterStore.activeToken(),
        },
      })
      const redundantEvents = [...this.upcomingEvents, ...data]
      this.upcomingEvents = uniqBy(redundantEvents, '_id').sort(
        (e1: Event, e2: Event) => {
          const date1 = new Date(e1.startDate)
          const date2 = new Date(e2.startDate)
          if (date1 > date2) {
            return 1
          } else if (date1 === date2) {
            return 0
          }
          return -1
        }
      )
      this.upcomingEvents.forEach(
        (event) => (this._eventsById[event._id] = event)
      )
    } catch (err) {
      console.log('Error loading upcoming events', err)
      throw err
    }
  }
}
