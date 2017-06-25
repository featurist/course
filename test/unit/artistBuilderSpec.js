const ArtistBuilder = require('../builders/artistBuilder')
const ReleaseBuilder = require('../builders/releaseBuilder')
const TrackBuilder = require('../builders/trackBuilder')
const expect = require('chai').expect

describe('ArtistBuilder', () => {
  it('builds an artist with no releases', () => {
    const artist = new ArtistBuilder().withName('Polysick').withId(10).build()
    expect(artist).to.eql({
      name: 'Polysick',
      id: 10
    })
  })

  it('builds an artist with a release with the same artist', () => {
    const artist = new ArtistBuilder()
      .withName('Polysick')
      .withId(10)
      .withReleases([
        new ReleaseBuilder()
          .withName('release name')
          .withNoOtherArtists()
          .withTracks([new TrackBuilder().build()])
          .build()
      ])
      .build()

    expect(artist).to.eql({
      name: 'Polysick',
      id: 10,
      releases: [
        {
          id: 1,
          name: 'release name',
          tracks: [
            {name: 'Track 1', duration: 30}
          ],
          artists: [
            {name: 'Polysick', id: 10}
          ]
        }
      ]
    })
  })

  it('builds an artist with a release with the same artist and additional artists', () => {
    const artist = new ArtistBuilder()
      .withName('Polysick')
      .withId(10)
      .withReleases([
        new ReleaseBuilder()
          .withName('release name')
          .withTracks([new TrackBuilder().build()])
          .withArtists([
            new ArtistBuilder().withName('Another artist').build()
          ])
          .build()
      ])
      .build()

    expect(artist).to.eql({
      name: 'Polysick',
      id: 10,
      releases: [
        {
          id: 1,
          name: 'release name',
          tracks: [
            {name: 'Track 1', duration: 30}
          ],
          artists: [
            {name: 'Another artist', id: 1},
            {name: 'Polysick', id: 10}
          ]
        }
      ]
    })
  })
})
