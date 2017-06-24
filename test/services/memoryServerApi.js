module.exports = class MemoryServerApi {
  constructor ({db, discogsApi}) {
    this.db = db
    this.discogsApi = discogsApi
  }

  async artist (id) {
    return this.db.artist(id)
  }

  async artists () {
    return this.db.artists()
  }

  async release (id) {
    return this.db.release(id)
  }

  async import (id) {
    const artist = this.discogsApi.artist(id)
    return this.db.addArtist(artist)
  }
}
