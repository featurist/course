const RealDatabaseService = require('./test/services/realDatabaseService')
const program = require('./tools/program')

program(async () => {
  const service = new RealDatabaseService()
  const db = (await service.create()).db

  const artist = db.model({table: 'artists'})
  const artistRelease = db.model({table: 'artists_releases'})
  const release = db.model({table: 'releases'})
  const track = db.model({table: 'tracks'})

  await release({
    name: 'release 1',

    artists: (release) => [
      artistRelease({
        artist: artist({name: 'artist one'}),
        release
      }),
      artistRelease({
        artist: artist({name: 'artist two'}),
        release
      })
    ],

    tracks: (release) => [
      track({name: 'track two', number: 2, duration: 30, release}),
      track({name: 'track one', number: 1, duration: 50, release})
    ]
  }).save()

  await service.printTables()
})
