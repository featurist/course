const createApp = require('../../server/app')
const serverDestroy = require('server-destroy')
const httpism = require('httpism')
const MemoryDatabase = require('./memoryDatabase')
const urlUtils = require('url')
const mountIFrame = require('browser-monkey/iframe')

module.exports = class AppService {
  constructor ({port = 7000, data} = {}) {
    this.port = port
    this.db = new MemoryDatabase({data})
  }

  async start () {
    this.server = createApp({db: this.db}).listen(this.port)
    this.url = `http://localhost:${this.port}/`
    serverDestroy(this.server)
    await httpism.client(this.url).get('/index.js')
  }

  mount (path = '/') {
    const url = urlUtils.resolve(this.url, path)
    return mountIFrame(url)
  }

  stop () {
    return new Promise(resolve => this.server.destroy(resolve))
  }
}
