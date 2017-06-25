const MemoryServerApi = require('../services/memoryServerApi')
const MemoryDatabase = require('../services/memoryDatabase')
const MemoryDiscogsApiService = require('../services/memoryDiscogsApiService')

module.exports = class MemoryServiceApiService {
  create () {
    this.db = new MemoryDatabase()
    this.discogsApiService = new MemoryDiscogsApiService()
    const discogsApi = this.discogsApiService.create()
    return new MemoryServerApi({db: this.db, discogsApi})
  }

  addDiscogsArtist (artist) {
    this.discogsApiService.addArtist(artist)
  }

  write (data) {
    this.db.write(data)
  }

  stop () {
  }
}
