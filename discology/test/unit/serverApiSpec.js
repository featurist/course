/* eslint-env mocha */

const describeDatabase = require('./describeDatabase')
const MemoryServerApi = require('../services/memoryServerApi')
const HttpServerApi = require('../../browser/httpServerApi')
const httpism = require('httpism')
const MemoryDatabase = require('../services/memoryDatabase')
const SqlDatabaseService = require('../services/sqlDatabaseService')
const createApp = require('../../server/app')

function describeServerApi (setup) {
  describeDatabase(setup)
}

describe('server api', function () {
  describe('#memory', function () {
    describeServerApi({
      create () {
        this.db = new MemoryDatabase()
        return new MemoryServerApi({db: this.db})
      },

      write (data) {
        this.db.write(data)
      },

      stop () {
      }
    })
  })

  describe('#http', function () {
    describeServerApi({
      async create () {
        this.sqlDatabaseService = new SqlDatabaseService()
        this.db = await this.sqlDatabaseService.create()
        this.server = createApp({db: this.db}).listen(4567)
        return new HttpServerApi({http: httpism.client('http://localhost:4567/')})
      },

      async write (data) {
        await this.sqlDatabaseService.write(data)
      },

      async stop () {
        await this.sqlDatabaseService.stop()
        this.server.close()
      }
    })
  })
})
