const discogsApi = {
  addArtist (id, data) {
  }
}

module.exports = function describeImportingArtist (apiService, discogsService) {
  describe('import', () => {
    let serverApi, discogsApi

    beforeEach(async () => {
      serverApi = await apiService.create()
      discogsApi = await discogsService.create()
      discogsApi.addArtist(1814667, {
        name: 'whatever'
      })
    })

    afterEach(async () => {
      await apiService.stop()
      await discogsService.stop()
    })

    it('can import a new artist', async () => {
      const artist = await serverApi.import(1814667)

      expect(artist).to.eql({
      })
    })
  }) 
}

