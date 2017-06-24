const HttpServerApi = require('../../browser/httpServerApi')
const httpism = require('httpism')
const SqlDatabaseService = require('../services/sqlDatabaseService')
const createApp = require('../../server/app')
const HttpDiscogsService = require('../services/httpDiscogsService')

module.exports = class HttpServerApiService {
  async create () {
    this.sqlDatabaseService = new SqlDatabaseService()
    const db = await this.sqlDatabaseService.create()

    this.discogsApiService = new HttpDiscogsService()
    const discogsApi = await this.discogsApiService.create()

    await new Promise(resolve => {
      this.server = createApp({
        db,
        discogsApi
      }).listen(4567, resolve)
    })

    return new HttpServerApi({
      http: httpism.client('http://localhost:4567/')
    })
  }

  async addDiscogsArtist (artist) {
    await this.discogsApiService.addArtist(artist)
  }

  async write (data) {
    await this.sqlDatabaseService.write(data)
  }

  async stop () {
    await this.sqlDatabaseService.stop()
    await this.discogsApiService.stop()
    await new Promise(resolve => {
      this.server.close(resolve)
    })
  }
}
