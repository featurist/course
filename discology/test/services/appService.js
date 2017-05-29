const createApp = require('../../server/app')
const serverDestroy = require('server-destroy')
const httpism = require('httpism')

module.exports = class AppService {
  constructor ({port = 7000, data} = {}) {
    this.port = port
    this.data = data
  }

  async start () {
    this.server = createApp({data: this.data}).listen(this.port)
    this.url = `http://localhost:${this.port}/`
    serverDestroy(this.server)
    await httpism.client(this.url).get('/index.js')
  }

  stop () {
    return new Promise(resolve => this.server.destroy(resolve))
  }
}
