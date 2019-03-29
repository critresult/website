import { observable } from 'mobx'
import axios from 'axios'
import PromoterStore from './promoter'
import uniqBy from 'lodash.uniqby'

interface Event {
  _id: string
  name: string
  startDate: string
  endDate: string
}

export default class EventStore {
  @observable upcomingEvents: Event[] = []
  @observable eventsById: {
    [key: string]: Event
  } = {}

  async load(_id: string) {
    try {
      const { data } = await axios.get('/events', {
        params: {
          token: PromoterStore.activeToken(),
          _id,
        },
      })
      console.log(data)
      this.eventsById[_id] = data
    } catch (err) {
      console.log('Error loading event by id', err)
      throw err
    }
  }

  async create(eventData: Event) {
    try {
      const { data } = await axios.post('/events', eventData)
      this.eventsById[data._id] = data
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
        (event) => (this.eventsById[event._id] = event)
      )
    } catch (err) {
      console.log('Error loading upcoming events', err)
      throw err
    }
  }
}
