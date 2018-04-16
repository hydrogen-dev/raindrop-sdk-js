const common = require('./lib/common.js')
const client = require('./lib/client.js')
const enterprise = require('./lib/enterprise.js')

module.exports = {
  setVerbose: common.setVerbose,
  setEnvironment: common.setEnvironment,
  client: client,
  enterprise: enterprise
}
