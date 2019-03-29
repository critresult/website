import { observable } from 'mobx'
import axios from 'axios'
import PromoterStore from './promoter'
import chunk from 'lodash.chunk'
import uniqby from 'lodash.uniqby'

export interface Rider {
  _id: string
  firstname: string
  lastname: string
  license: string
}

export default class RiderStore {
  @observable ridersById: {
    [key: string]: Rider
  } = {}

  async load(_id: string) {
    try {
      const { data } = await axios.get('/riders', {
        params: {
          _id,
          token: PromoterStore.activeToken(),
        },
      })
      this.ridersById[_id] = data
    } catch (err) {
      console.log('Error loading rider by id', err)
      throw err
    }
  }

  async update(where: any, changes: any) {
    try {
      await axios.put('/riders', {
        where,
        changes,
        token: PromoterStore.activeToken(),
      })
    } catch (err) {
      console.log('Error updating document', err)
      throw err
    }
  }

  async search(value: string) {
    try {
      const { data } = await axios.get('/riders/search', {
        params: {
          search: value,
          token: PromoterStore.activeToken(),
        },
      })
      return data
    } catch (err) {
      console.log('Error searching', err)
      throw err
    }
  }

  async createMany(models: any) {
    try {
      const chunks = chunk(uniqby(models, 'license'), 100)
      const created = []
      for (const modelChunk of chunks) {
        console.log(modelChunk)
        const { data } = await axios
          .post('/riders', {
            models: modelChunk,
            token: PromoterStore.activeToken(),
          })
          .catch(() => ({ data: []}))
        created.push(...data)
        await new Promise(r => setTimeout(r, 1000))
      }
      created.map((model: Rider) => (this.ridersById[model._id] = model))
    } catch (err) {
      console.log('Error creating many models', err)
      throw err
    }
  }

  async create(riderData: any) {
    try {
      const { data } = await axios.post('/riders', {
        ...riderData,
        token: PromoterStore.activeToken(),
      })
      this.ridersById[data._id] = data
    } catch (err) {
      console.log('Error creating rider', err)
      throw err
    }
  }
}
