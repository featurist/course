const createApp = require('../../server/app')
const serverDestroy = require('server-destroy')
const httpism = require('httpism')
const SqlDatabaseService = require('../services/sqlDatabaseService')
const urlUtils = require('url')
const pathUtils = require('path')
const mountIFrame = require('browser-monkey/iframe')
const fs = require('mz/fs')

module.exports = class AppService {
  constructor ({port = 7000} = {}) {
    this.port = port
    this.sqlDatabaseService = new SqlDatabaseService()
  }

  async start ({data} = {}) {
    const dbFilename = pathUtils.join(__dirname, 'test.db')
    if (await fs.exists(dbFilename)) {
      await fs.unlink(dbFilename)
    }

    const db = await this.sqlDatabaseService.create()
    await this.sqlDatabaseService.write(data)

    this.server = createApp({db}).listen(this.port)
    this.url = `http://localhost:${this.port}/`
    serverDestroy(this.server)
    await httpism.client(this.url).get('/index.js')
  }

  mount (path = '/') {
    const url = urlUtils.resolve(this.url, path)
    return mountIFrame(url)
  }

  async stop () {
    await this.sqlDatabaseService.stop()
    return new Promise(resolve => this.server.destroy(resolve))
  }
}
