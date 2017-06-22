const expect = require('chai').expect
const DiscogsApi = require('../../server/discogsApi')

describe('discogs', () => {
  let discogsApi

  beforeEach(() => {
    discogsApi = new DiscogsApi()
  })

  it('can download an artist', async () => {
    const artist = await discogsApi.artist(1814667)
    expect(artist.releases.length).to.equal(7)
    artist.releases = [artist.releases[0]]
    expect(artist).to.eql({
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
    })
  })
})
