// Used for globally loading models (caching)

export default class Hydrated {
  static stores: {
    [key: string]: Hydrated
  } = {}

  static async hydrate(...args: string[]) {
    try {
      const promises = []
      for (const key in this.stores) {
        if (args.length && args.indexOf(key) !== -1) continue
        promises.push(this.stores[key].hydrate())
      }
      await Promise.all(promises)
      if (args.length) {
        console.log(`The following stores were rehydrated: ${args}`)
      } else {
        console.log('All stores rehydrated')
      }
    } catch (err) {
      console.log('Error rehydrating stores', err)
    }
  }

  hydrate() {
    throw new Error('Override hydrate() in Hydrated subclasses')
  }
}
