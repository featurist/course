const httpism = require('httpism')

module.exports = class HttpServerApi {
  constructor ({http = httpism} = {}) {
    this.http = http
  }

  artists () {
    return this.http.get('/api/artists')
  }

  artist (id) {
    return this.http.get('/api/artists/:artistId', {params: {artistId: id}})
  }

  release (id) {
    return this.http.get('/api/releases/:releaseId', {params: {releaseId: id}})
  }

  import (id) {
    return this.http.post('/api/import/:artistId', {}, {params: {artistId: id}})
  }
}
