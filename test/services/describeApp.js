/* eslint-env mocha */

const BrowserAppService = require('./browserAppService')
const FullAppService = require('./fullAppService')

module.exports = function (desc, fn) {
  describe('#browser ' + desc, function () {
    fn(new BrowserAppService())
  })
  describe('#full ' + desc, function () {
    fn(new FullAppService())
  })
}
