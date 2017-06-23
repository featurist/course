  describe('loading artists and releases', () => {
    describeDatabase(setup)
  })

  describe('import', () => {
    let serverApi

    beforeEach(async () => {
      serverApi = await setup.create()
      discogsApi.addArtist(1814667, {
        ...
      })
    })

    it('can import a new artist', async () => {
      await serverApi.import(1814667)
      const artist = await serverApi.artist(1814667)

      expect(artist).to.eql({
      })
    })
  })
