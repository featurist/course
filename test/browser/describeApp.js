/* eslint-env mocha */

const FakeAppService = require('../services/fakeAppService')
const RealAppService = require('../services/realAppService')

module.exports = function (desc, fn) {
  describe('#fake ' + desc, function () {
    fn(new FakeAppService())
  })
  describe('#real ' + desc, function () {
    fn(new RealAppService())
  })
}
