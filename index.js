const client = require('./src/client_calls.js')
const messages = require('./src/client_messages')
const enterprise = require('./src/enterprise_calls.js')

client.generateMessage = messages.generateMessage

module.exports = {
  client: client,
  enterprise: enterprise
}
