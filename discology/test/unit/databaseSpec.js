/* eslint-env mocha */

const MemoryDatabase = require('../services/memoryDatabase')
const SqlDatabaseService = require('../services/sqlDatabaseService')
const describeDatabase = require('./describeDatabase')

describe('database', function () {
  describe('#memory', function () {
    describeDatabase({
      create () {
        this.db = new MemoryDatabase()
        return this.db
      },

      write (data) {
        this.db.write(data)
      },

      stop () {
      }
    })
  })

  describe('#sql', function () {
    describeDatabase(new SqlDatabaseService())
  })
})
