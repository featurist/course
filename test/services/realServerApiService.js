const HttpServerApi = require('../../browser/httpServerApi')
const httpism = require('httpism')
const RealDatabaseService = require('../services/realDatabaseService')
const createApp = require('../../server/app')
const RealDiscogsApiService = require('../services/realDiscogsApiService')
const serverDestroy = require('server-destroy')

module.exports = class RealServerApiService {
  constructor ({port = 4567} = {}) {
    this.port = port
  }

  async create () {
    this.databaseService = new RealDatabaseService()
    const db = await this.databaseService.create()

    this.discogsApiService = new RealDiscogsApiService()
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
    await this.databaseService.write(data)
  }

  async stop () {
    await this.databaseService.stop()
    await this.discogsApiService.stop()
    await new Promise(resolve => this.server.destroy(resolve))
  }
}
