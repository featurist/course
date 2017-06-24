/* eslint-env mocha */

const expect = require('chai').expect

module.exports = function (databaseService) {
  describe('load artist and releases', () => {
    let database

    beforeEach(async () => {
      database = await databaseService.create()
    })

    afterEach(async () => {
      await databaseService.stop()
    })

    it('can load all artists', async () => {
      await databaseService.write({
        releases: [
          {
            name: 'one',
            artists: [
              {
                id: 1,
                name: 'artist 1'
              },
              {
                id: 2,
                name: 'artist 2' }
            ]
          },
          {
            name: 'two',
            artists: [
              {
                id: 3,
                name: 'artist 3'
              }
            ]
          }
        ]
      })

      const artists = await database.artists()
      expect(artists).to.eql([
        {
          id: 1,
          name: 'artist 1'
        },
        {
          id: 2,
          name: 'artist 2'
        },
        {
          id: 3,
          name: 'artist 3'
        }
      ])
    })

    it('returns undefined if artist not found', async () => {
      const artist = await database.artist(3)
      expect(artist).to.equal(undefined)
    })

    it('returns undefined if release not found', async () => {
      const release = await database.release(3)
      expect(release).to.equal(undefined)
    })

    it('can load release with no tracks or artists', async () => {
      await databaseService.write({
        releases: [
          {
            id: 1,
            name: 'one',
            artists: [],
            tracks: []
          }
        ]
      })

      const release = await database.release(1)
      expect(release).to.eql({
        id: 1,
        name: 'one',
        artists: [],
        tracks: []
      })
    })

    context('with two artists, two releases', () => {
      beforeEach(async () => {
        await databaseService.write({
          releases: [
            {
              id: 1,
              name: 'one',
              artists: [
                {
                  id: 1,
                  name: 'artist 1'
                },
                {
                  id: 2,
                  name: 'artist 2'
                }
              ],
              tracks: [
                {name: 'xxx one: track 1', duration: 30},
                {name: 'aaa one: track 2', duration: 30}
              ]
            },
            {
              id: 2,
              name: 'two',
              artists: [
                {
                  id: 2,
                  name: 'artist 2'
                }
              ],
              tracks: [
                {name: 'two: track 1', duration: 30}
              ]
            }
          ]
        })
      })

      it('can load a single artist and all their releases', async () => {
        const artist = await database.artist(2)
        expect(artist).to.eql({
          id: 2,
          name: 'artist 2',
          releases: [
            {
              id: 1,
              name: 'one',
              artists: [
                {
                  id: 1,
                  name: 'artist 1'
                },
                {
                  id: 2,
                  name: 'artist 2'
                }
              ],
              tracks: [
                {name: 'xxx one: track 1', duration: 30},
                {name: 'aaa one: track 2', duration: 30}
              ]
            },
            {
              id: 2,
              name: 'two',
              artists: [
                {
                  id: 2,
                  name: 'artist 2'
                }
              ],
              tracks: [
                {name: 'two: track 1', duration: 30}
              ]
            }
          ]
        })
      })

      it('can load a single artist and only their releases', async () => {
        const artist = await database.artist(1)
        expect(artist).to.eql({
          id: 1,
          name: 'artist 1',
          releases: [
            {
              id: 1,
              name: 'one',
              artists: [
                {
                  id: 1,
                  name: 'artist 1'
                },
                {
                  id: 2,
                  name: 'artist 2'
                }
              ],
              tracks: [
                {name: 'xxx one: track 1', duration: 30},
                {name: 'aaa one: track 2', duration: 30}
              ]
            }
          ]
        })
      })
    })

    it('can load a release', async () => {
      await databaseService.write({
        releases: [
          {
            id: 1,
            name: 'one',
            artists: [
              {
                id: 1,
                name: 'artist 1'
              }
            ],
            tracks: [
              {name: 'one: track 1', duration: 30}
            ]
          },
          {
            id: 2,
            name: 'two',
            artists: [
              {
                id: 2,
                name: 'artist 2'
              }
            ],
            tracks: [
              {name: 'xxx two: track 1', duration: 30},
              {name: 'aaa two: track 1', duration: 30}
            ]
          }
        ]
      })

      const release = await database.release(2)

      expect(release).to.eql({
        id: 2,
        name: 'two',
        artists: [
          {
            id: 2,
            name: 'artist 2'
          }
        ],
        tracks: [
          {name: 'xxx two: track 1', duration: 30},
          {name: 'aaa two: track 1', duration: 30}
        ]
      })
    })
  })
}
