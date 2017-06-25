const httpism = require('httpism')

module.exports = class HttpServerApi {
  constructor ({http = httpism} = {}) {
    this.http = http.client(
      {
        exceptions (response) {
          return !(response.statusCode >= 200 || response.statusCode < 400 || response.statusCode === 404)
        }
      },
      notFoundUndefinedBody
    )
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

async function notFoundUndefinedBody (req, next) {
  const response = await next()
  if (response.statusCode === 404) {
    response.body = undefined
  }
  return response
}
