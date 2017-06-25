const HttpServerApiService = require('../services/httpServerApiService')
const httpism = require('httpism')
const urlUtils = require('url')
const mountIFrame = require('browser-monkey/iframe')

module.exports = class AppService {
  constructor ({port = 7000} = {}) {
    this.port = port
    this.serverApiService = new HttpServerApiService()
  }

  async start ({data} = {}) {
    await this.serverApiService.create()
    await this.serverApiService.write(data)
    await httpism.client(this.serverApiService.url).get('/index.js')
  }

  async addDiscogsArtist (artist) {
    await this.serverApiService.addDiscogsArtist(artist)
  }

  mount (path = '/') {
    const url = urlUtils.resolve(this.serverApiService.url, path)
    return mountIFrame(url)
  }

  async stop () {
    await this.serverApiService.stop()
  }
}
