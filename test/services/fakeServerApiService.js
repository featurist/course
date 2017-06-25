const FakeServerApi = require('../services/fakeServerApi')
const FakeDatabase = require('../services/fakeDatabase')
const FakeDiscogsApiService = require('../services/fakeDiscogsApiService')

module.exports = class FakeServerApiService {
  create () {
    this.db = new FakeDatabase()
    this.discogsApiService = new FakeDiscogsApiService()
    const discogsApi = this.discogsApiService.create()
    return new FakeServerApi({db: this.db, discogsApi})
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
