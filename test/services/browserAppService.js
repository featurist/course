const App = require('../../browser/app')
const MemoryServerApiService = require('./memoryServerApiService')
const mountHyperdom = require('browser-monkey/hyperdom')
const router = require('hyperdom/router')

require('browser-monkey/lib/reloadButton')()

module.exports = class BrowserAppService {
  async start ({data = {releases: []}} = {}) {
    this.serverApiService = new MemoryServerApiService()
    const serverApi = await this.serverApiService.create(data)
    await this.serverApiService.write(data)
    this.app = new App({serverApi})
    this.router = router
  }

  async addDiscogsArtist (artist) {
    await this.serverApiService.addDiscogsArtist(artist)
  }

  mount (path = '/') {
    return mountHyperdom(this.app, {url: path, router: this.router})
  }

  stop () {
  }
}
