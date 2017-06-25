const App = require('../../browser/app')
const FakeServerApiService = require('./fakeServerApiService')
const mountHyperdom = require('browser-monkey/hyperdom')
const router = require('hyperdom/router')

require('browser-monkey/lib/reloadButton')()

module.exports = class FakeAppService {
  async start ({data = {releases: []}} = {}) {
    this.serverApiService = new FakeServerApiService()
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
