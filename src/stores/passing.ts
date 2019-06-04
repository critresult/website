import { observable } from 'mobx'
import axios from 'axios'
import PromoterStore from './promoter'

export class Passing {
  _id: string
  date: Date
  transponder: string
  riderId: string
  seriesId: string
  raceId: string
  lapCount?: number
  dnf?: boolean
  dns?: boolean
  constructor(args: Optional<Passing>) {
    Object.assign(this, {
      ...args,
      date: new Date(args.date),
    })
  }
}

// Mark all properties optional on a type T
type Optional<T> = { [P in keyof T]?: T[P] }

export default class PassingStore {
  @observable private _passingsByRaceId: {
    [key: string]: Passing[]
  } = {}

  byRaceId(id: string) {
    return this._passingsByRaceId[id] || []
  }

  async loadByRaceId(id: string) {
    try {
      const { data } = await axios.get('/passings', {
        params: {
          raceId: id,
          token: PromoterStore.activeToken(),
        },
      })
      this._passingsByRaceId[id] = data
        .map((d: any) => new Passing(d))
        .sort((p1: Passing, p2: Passing) => {
          if (p1.date > p2.date) return 1
          return -1
        })
    } catch (err) {
      console.log('Error loading passings for raceId ', id, err)
      throw err
    }
  }
}
