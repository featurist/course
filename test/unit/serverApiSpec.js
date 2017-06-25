/* eslint-env mocha */
const describeLoadingArtistReleases = require('./describeLoadingArtistReleases')
const expect = require('chai').expect
const FakeServerApiService = require('../services/fakeServerApiService')
const RealServerApiService = require('../services/realServerApiService')

function describeServerApi (serverApiService) {
  describeLoadingArtistReleases(serverApiService)

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
      await serverApi.import(1814667)
      const artist = await serverApi.artist(1814667)

      expect(artist).to.eql(discogsArtist)
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
