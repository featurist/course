/* eslint-env mocha */

const expect = require('chai').expect

module.exports = function (databaseService) {
  let database
  describe('load artist and releases', () => {
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
        expect(clone(artist)).to.eql({
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
        expect(clone(artist)).to.eql({
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

      expect(clone(release)).to.eql({
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

function clone (x) {
  return JSON.parse(JSON.stringify(x))
}
