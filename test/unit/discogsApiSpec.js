const expect = require('chai').expect
const httpism = require('httpism')
const DiscogsApi = require('../../server/discogsApi')
const cache = require('httpism/middleware/cache')
const HttpDiscogsApiService = require('../services/httpDiscogsApiService')

function describeDiscogsApi (discogsApiService) {
  let discogsApi
  let discogsArtist

  beforeEach(async () => {
    discogsApi = await discogsApiService.create()
    discogsArtist = {
      id: 1814667,
      name: 'Polysick',
      releases: [
        {
          id: 446546,
          name: 'Digital Native',
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
            },
            {
              duration: 343,
              name: 'Taito'
            },
            {
              duration: 245,
              name: 'Loading...'
            },
            {
              duration: 107,
              name: 'Lost Holidays'
            },
            {
              duration: 329,
              name: 'Caravan'
            },
            {
              duration: 220,
              name: 'Drowse'
            },
            {
              duration: 197,
              name: 'Tic-Tac Toe'
            },
            {
              duration: 179,
              name: 'Meltinacid'
            },
            {
              duration: 294,
              name: 'Gondwana'
            },
            {
              duration: 365,
              name: 'Preda'
            },
            {
              duration: 207,
              name: 'World Cup'
            },
            {
              duration: 176,
              name: 'Bermuda'
            },
            {
              duration: 549,
              name: 'Transpelagic'
            },
            {
              duration: 124,
              name: 'Smudge, Hawaii'
            }
          ]
        }
      ]
    }
    discogsApiService.addArtist(discogsArtist)
  })

  afterEach(async () => {
    await discogsApiService.stop()
  })

  it('can download an artist', async () => {
    const artist = await discogsApi.artist(1814667)
    artist.releases = [artist.releases[0]]
    expect(artist).to.eql(discogsArtist)
  })
}

class RealDiscogsApiService {
  create () {
    return new DiscogsApi({
      http: httpism.client(cache({url: `${__dirname}/discogs-cache`}))
    })
  }

  addArtist () {
  }

  stop () {
  }
}

describe('discogs api', () => {
  describe('#http', () => {
    describeDiscogsApi(new HttpDiscogsApiService())
  })

  describe('#discogs', () => {
    describeDiscogsApi(new RealDiscogsApiService())
  })
})
