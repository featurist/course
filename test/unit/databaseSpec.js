/* eslint-env mocha */
const expect = require('chai').expect

const FakeDatabase = require('../services/fakeDatabase')
const RealDatabaseService = require('../services/realDatabaseService')
const describeLoadingArtistReleases = require('./describeLoadingArtistReleases')
const ArtistBuilder = require('../builders/artistBuilder')
const ReleaseBuilder = require('../builders/releaseBuilder')

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
      const artist = new ArtistBuilder()
        .withName('artist 1')
        .withId(10)
        .withReleases([
          new ReleaseBuilder()
            .withName('release 1')
            .withId(1)
            .withArtists([
              new ArtistBuilder().withName('artist 1').withId(10).build(),
              new ArtistBuilder().withName('artist 2').withId(20).build()
            ])
            .withTracks(2)
            .build()
        ])
        .build()

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
