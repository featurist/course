const config = process.env.TEST_CONFIG

const services = {
  browser: () => require('./browserAppService'),
  full: () => require('./fullAppService')
}

const requireService = services[config]

if (!requireService) {
  throw new Error('please set `TEST_CONFIG` to one of ' + Object.keys(services).join(', '))
}

module.exports = requireService()
