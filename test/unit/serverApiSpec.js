/* eslint-env mocha */
const describeLoadingArtistReleases = require('./describeLoadingArtistReleases')
const describeImportingArtist = require('./describeImportingArtist')
const MemoryServerApi = require('../services/memoryServerApi')
const HttpServerApi = require('../../browser/httpServerApi')
const httpism = require('httpism')
const MemoryDatabase = require('../services/memoryDatabase')
const SqlDatabaseService = require('../services/sqlDatabaseService')
const createApp = require('../../server/app')

class MemoryApiService {
  create () {
    this.db = new MemoryDatabase()
    return new MemoryServerApi({db: this.db})
  }

  write (data) {
    this.db.write(data)
  }

  stop () {
  }
}

class HttpApiService {
  async create () {
    this.sqlDatabaseService = new SqlDatabaseService()
    this.db = await this.sqlDatabaseService.create()
    this.server = createApp({
      db: this.db,
      discogsUrl: 'http://localhost:6789/'
    }).listen(4567)
    return new HttpServerApi({
      http: httpism.client('http://localhost:4567/')
    })
  }

  async write (data) {
    await this.sqlDatabaseService.write(data)
  }

  async stop () {
    await this.sqlDatabaseService.stop()
    this.server.close()
  }
}

class DiscogsService {
  async create () {
    const db = {
      artists: {}
    }

    const api = {
      addArtist(id, data) {
        db.artists[id] = data
      }
    }
    const express = require('express')
    const app = express()
    app.get('/artists/:artistId', (req, res) => {
      res.send(db.artists[req.params.artistId])
    })

    this.server = app.listen(6789)

    return api
  }

  async stop () {
    this.server.close()
  }
}
describe('server api', function () {
  describe('#memory', function () {
    const apiService = new MemoryApiService()
    describeLoadingArtistReleases(apiService)
    describeImportingArtist(apiService, new DiscogsService())
  })

  describe('#http', function () {
    const apiService = new HttpApiService()
    describeLoadingArtistReleases(apiService)
    describeImportingArtist(apiService, new DiscogsService())
  })
})
