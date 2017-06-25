class MemoryDiscogsApi {
  constructor ({artists}) {
    this.artists = artists
  }

  artist (id) {
    return this.artists[id]
  }
}

module.exports = class FakeDiscogsApiService {
  constructor () {
    this.artists = {}
  }

  create () {
    return new MemoryDiscogsApi({artists: this.artists})
  }

  async addArtist (artist) {
    this.artists[artist.id] = artist
  }

  async stop () {
  }
}
