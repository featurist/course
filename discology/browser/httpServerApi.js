const httpism = require('httpism')

module.exports = class HttpServerApi {
  artists () {
    return httpism.get('/api/artists')
  }

  artist (id) {
    return httpism.get('/api/artists/:artistId', {params: {artistId: id}})
  }

  release (id) {
    return httpism.get('/api/releases/:releaseId', {params: {releaseId: id}})
  }
}
