/* eslint-env mocha */

const expect = require('chai').expect
const MemoryDatabase = require('../services/memoryDatabase')
const SqlDatabase = require('../../server/sqlDatabase')
const pathUtils = require('path')
const fs = require('mz/fs')

function describeDatabase (name, createDatabase) {
  context(`${name} database`, () => {
    let database

    beforeEach(async () => {
      database = await createDatabase()
    })

    it('can load all artists', async () => {
      await database.write({
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
        await database.write({
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
                {name: 'one: track 1', duration: 30}
              ]
            }
          ]
        })
      })
    })

    it('can load a release', async () => {
      await database.write({
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
              {name: 'two: track 1', duration: 30}
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
          {name: 'two: track 1', duration: 30}
        ]
      })
    })
  })
}

function clone (x) {
  return JSON.parse(JSON.stringify(x))
}

describeDatabase('#memory', () => new MemoryDatabase())
describeDatabase('#sql', async () => {
  const dbFilename = pathUtils.join(__dirname, '/test.db')
  if (await fs.exists(dbFilename)) {
    await fs.unlink(dbFilename)
  }
  const db = new SqlDatabase(dbFilename)
  await db.createSchema()
  return db
})
