const router = require('hyperdom/router')

module.exports = {
  home: router.route('/'),
  artist: router.route('/artists/:artistId'),
  release: router.route('/releases/:releaseId')
}
