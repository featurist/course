/* eslint-env mocha */
const expect = require('chai').expect

const MemoryDatabase = require('../services/memoryDatabase')
const SqlDatabaseService = require('../services/sqlDatabaseService')
const describeLoadingArtistReleases = require('./describeLoadingArtistReleases')

class MemoryDatabaseService {
  create () {
    this.db = new MemoryDatabase()
    return this.db
  }

  write (data) {
    this.db.write(data)
  }

  stop () {
  }
}

describe('database', function () {
  describe('#memory', function () {
    describeLoadingArtistReleases(new MemoryDatabaseService())
  })

  describe('#sql', function () {
    describeLoadingArtistReleases(new SqlDatabaseService())
  })
})

