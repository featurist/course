/* eslint-env mocha */

const FakeAppService = require('../services/fakeAppService')
const RealAppService = require('../services/realAppService')

module.exports = function (desc, fn) {
  describe(desc, function () {
    fn(new FakeAppService())
  })
}
