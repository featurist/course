const createApp = require('../../server/app')
const serverDestroy = require('server-destroy')
const httpism = require('httpism')
const SqlDatabase = require('../../server/sqlDatabase')
const urlUtils = require('url')
const pathUtils = require('path')
const mountIFrame = require('browser-monkey/iframe')
const fs = require('mz/fs')

module.exports = class AppService {
  constructor ({port = 7000, data} = {}) {
    this.port = port
    this.data = data
  }

  async start () {
    const dbFilename = pathUtils.join(__dirname, 'test.db')
    if (await fs.exists(dbFilename)) {
      await fs.unlink(dbFilename)
    }
    const db = new SqlDatabase({driver: 'sqlite', url: dbFilename})
    await db.createSchema()
    await db.write(this.data)
    this.server = createApp({db}).listen(this.port)
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
