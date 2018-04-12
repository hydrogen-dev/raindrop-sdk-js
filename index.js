const common = require('./lib/common.js')
const client = require('./lib/client.js')
const enterprise = require('./lib/enterprise.js')

common.polyfillArrayFrom()

module.exports = {
  client: client,
  enterprise: enterprise
}
