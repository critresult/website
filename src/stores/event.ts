import { observable } from 'mobx'
import axios from 'axios'
import PromoterStore from './promoter'
import uniqBy from 'lodash.uniqby'

interface Event {
  _id: string
  name: string
}

export default class EventStore {
  @observable upcomingEvents: Event[] = []

  async loadUpcoming() {
    try {
      const { data } = await axios.get('/event/upcoming', {
        params: {
          token: PromoterStore.activeToken(),
        },
      })
      const redundantEvents = [...this.upcomingEvents, ...data]
      this.upcomingEvents = uniqBy(redundantEvents, '_id')
    } catch (err) {
      console.log('Error loading upcoming events', err)
      throw err
    }
  }
}
