/* eslint-env mocha */
const describeLoadingArtistReleases = require('./describeLoadingArtistReleases')
const expect = require('chai').expect
const FakeServerApiService = require('../services/fakeServerApiService')
const RealServerApiService = require('../services/realServerApiService')

function describeServerApi (serverApiService) {
  describeLoadingArtistReleases(serverApiService)

  describe.only('loading artists and releases', () => {
    let serverApi

    beforeEach(async () => {
      serverApi = await serverApiService.create()
    })

    afterEach(async () => {
      await serverApiService.stop()
    })

    it('can load all artists', async () => {
      // setup
      await serverApiService.write({
        releases: [
        ]
      })

      // ensure that we can load all artists
    })

    it('can load a release', async () => {
      // setup
      await serverApiService.write({
        releases: [
        ]
      })

      // ensure that we can load a release
    })
  })

  describe('import', () => {
    let serverApi
    let discogsArtist

    beforeEach(async () => {
      serverApi = await serverApiService.create()

      discogsArtist = {
        name: 'Polysick',
        id: 1814667,
        releases: [
          {
            name: 'Digital Native',
            id: 123,

            artists: [
              {
                name: 'Polysick',
                id: 1814667
              }
            ],

            tracks: [
              {
                duration: 159,
                name: 'Totem'
              },
              {
                duration: 100,
                name: 'Woods'
              }
            ]
          }
        ]
      }
      await serverApiService.addDiscogsArtist(discogsArtist)
    })

    afterEach(async () => {
      await serverApiService.stop()
    })

    it('can import a new artist', async () => {
      // ensure that we can import an artist
    })
  })
}

describe('server api', function () {
  describe('#fake', function () {
    describeServerApi(new FakeServerApiService())
  })

  describe('#real', function () {
    describeServerApi(new RealServerApiService())
  })
})
