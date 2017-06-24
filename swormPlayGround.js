const SqlDatabaseService = require('./test/services/sqlDatabaseService');

(async () => {
  const service = new SqlDatabaseService()
  const db = (await service.create()).db

  const artist = db.model({table: 'artists'})
  const release = db.model({table: 'releases'})
  const track = db.model({table: 'tracks'})

  await release({
    name: 'release 1',

    artists: (release) => [
      artist({name: 'artist one', release: release}),
      artist({name: 'artist two', release: release})
    ],

    tracks: (release) => [
      track({name: 'track two', number: 2, duration: 30, release}),
      track({name: 'track one', number: 1, duration: 50, release})
    ]
  }).save()

  await service.printTables()
})()
