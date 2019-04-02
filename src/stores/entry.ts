import { observable } from 'mobx'
import axios from 'axios'
import PromoterStore from './promoter'
import { Rider } from './rider'
import { Race } from './race'
import Hydrated from 'hydrated'
import groupby from 'lodash.groupby'
import keyby from 'lodash.keyby'

export interface Entry {
  _id: string
  riderId: string
  raceId: string
  bib: string
  race?: Race
  rider?: Rider
}

export default class EntryStore implements Hydrated {
  async hydrate() {}
}
