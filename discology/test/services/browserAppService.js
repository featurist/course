const App = require('../../browser/app')
const MemoryDatabase = require('./memoryDatabase')
const MemoryServerApi = require('./memoryServerApi')
const mountHyperdom = require('browser-monkey/hyperdom')
const router = require('hyperdom/router')

require('browser-monkey/lib/reloadButton')()

module.exports = class MockAppService {
  constructor ({data} = {}) {
    const db = new MemoryDatabase({data})
    this.app = new App({serverApi: new MemoryServerApi({db})})
    this.router = router
  }

  async start () {
  }

  mount (path = '/') {
    return mountHyperdom(this.app, {url: path, router: this.router})
  }

  stop () {
  }
}
