/* eslint-env mocha */
const expect = require('chai').expect

const FakeDatabase = require('../services/fakeDatabase')
const RealDatabaseService = require('../services/realDatabaseService')
const describeLoadingArtistReleases = require('./describeLoadingArtistReleases')

class MemoryDatabaseService {
  create () {
    this.db = new FakeDatabase()
    return this.db
  }

  write (data) {
    this.db.write(data)
  }

  stop () {
  }
}

function describeDatabase (databaseService) {
  describeLoadingArtistReleases(databaseService)

  describe('importing', () => {
    let db

    beforeEach(async () => {
      db = await databaseService.create()
    })

    afterEach(async () => {
      await databaseService.stop()
    })

    it('can import an artist', async () => {
      const artist = {
        name: 'artist 1',
        id: 10,
        releases: [
          {
            name: 'release 1',
            id: 1,
            tracks: [
              {name: 'track 1', duration: 30},
              {name: 'track 2', duration: 30}
            ],
            artists: [
              {
                id: 10,
                name: 'artist 1'
              },
              {
                id: 20,
                name: 'artist 2'
              }
            ]
          }
        ]
      }

      await db.addArtist(artist)
      const importedArtist = await db.artist(artist.id)

      expect(importedArtist).to.eql(artist)
    })
  })
}

describe('database', function () {
  describe('#fake', function () {
    describeDatabase(new MemoryDatabaseService())
  })

  describe('#real', function () {
    describeDatabase(new RealDatabaseService())
  })
})
