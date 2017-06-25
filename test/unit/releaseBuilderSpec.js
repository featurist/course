const ReleaseBuilder = require('../builders/releaseBuilder')
const expect = require('chai').expect

describe('ReleaseBuilder', () => {
  it('by default builds a release with an artist and 3 tracks', () => {
    const release = new ReleaseBuilder().build()

    expect(release).to.eql({
      id: 1,
      name: 'Release',
      artists: [
        {name: 'Artist', id: 1}
      ],
      tracks: [
        {duration: 30, name: 'Track 1'},
        {duration: 60, name: 'Track 2'},
        {duration: 90, name: 'Track 3'}
      ]
    })
  })

  it('can specify the number of tracks', () => {
    const release = new ReleaseBuilder().withTracks(2).build()

    expect(release).to.eql({
      id: 1,
      name: 'Release',
      artists: [
        {name: 'Artist', id: 1}
      ],
      tracks: [
        {duration: 30, name: 'Track 1'},
        {duration: 60, name: 'Track 2'}
      ]
    })
  })
})
