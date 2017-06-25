const HttpServerApi = require('../../browser/httpServerApi')
const httpism = require('httpism')
const SqlDatabaseService = require('../services/sqlDatabaseService')
const createApp = require('../../server/app')
const HttpDiscogsApiService = require('../services/httpDiscogsApiService')
const serverDestroy = require('server-destroy')

module.exports = class HttpServerApiService {
  constructor ({port = 4567} = {}) {
    this.port = port
  }

  async create () {
    this.sqlDatabaseService = new SqlDatabaseService()
    const db = await this.sqlDatabaseService.create()

    this.discogsApiService = new HttpDiscogsApiService()
    const discogsApi = await this.discogsApiService.create()

    const app = createApp({
      db,
      discogsApi
    })

    await new Promise(resolve => {
      this.server = app.listen(this.port, resolve)
    })

    this.url = `http://localhost:${this.port}/`
    serverDestroy(this.server)

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
    await new Promise(resolve => this.server.destroy(resolve))
  }
}
