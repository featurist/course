const expect = require('chai').expect
const idFromDiscogsUrl = require('../../browser/idFromDiscogsUrl')

describe('idFromDiscogsUrl', () => {
  it('returns the ID from a discogs artist URL', () => {
    const id = idFromDiscogsUrl('https://www.discogs.com/artist/1814667-Polysick')
    expect(id).to.equal(1814667)
  })

  it('returns undefined if the URL is not recognised', () => {
    const id = idFromDiscogsUrl('https://www.discogs.com/releases/1814667-Polysick')
    expect(id).to.equal(undefined)
  })
})
