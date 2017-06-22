const App = require('../../browser/app')
const MemoryDatabase = require('./memoryDatabase')
const MemoryServerApi = require('./memoryServerApi')
const mountHyperdom = require('browser-monkey/hyperdom')
const router = require('hyperdom/router')

require('browser-monkey/lib/reloadButton')()

module.exports = class BrowserAppService {
  async start ({data} = {}) {
    const db = new MemoryDatabase({data})
    this.app = new App({serverApi: new MemoryServerApi({db})})
    this.router = router
  }

  mount (path = '/') {
    return mountHyperdom(this.app, {url: path, router: this.router})
  }

  stop () {
  }
}
