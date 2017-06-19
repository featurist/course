/* eslint-env mocha */

module.exports = function (desc, fn) {
  describe('#browser ' + desc, function () {
    fn(require('./browserAppService'))
  })
  describe('#full ' + desc, function () {
    fn(require('./fullAppService'))
  })
}
