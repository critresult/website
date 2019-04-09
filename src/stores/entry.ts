import { observable } from 'mobx'
import axios from 'axios'
import { Rider } from './rider'
import { Race } from './race'

export interface Entry {
  _id: string
  riderId: string
  raceId: string
  bib: string
  race?: Race
  rider?: Rider
}

export default class EntryStore {}
