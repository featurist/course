const createApp = require('../../server/app')
const App = require('../../browser/app')
const vinehill = require('vinehill')
const MemoryDatabase = require('./memoryDatabase')
const mountHyperdom = require('browser-monkey/hyperdom')
const router = require('hyperdom/router')

require('browser-monkey/lib/reloadButton')()

module.exports = class MockAppService {
  constructor ({data} = {}) {
    this.db = new MemoryDatabase({data})
    this.app = new App()
    this.router = router
  }

  async start () {
    this.server = vinehill({
      'http://example.com/': createApp({db: this.db})
    })
  }

  mount (path = '/') {
    return mountHyperdom(this.app, {url: path, router: this.router})
  }

  stop () {
    vinehill.remove()
  }
}
