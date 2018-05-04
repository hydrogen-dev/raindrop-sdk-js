const client = require('./src/clientCalls.js')
const server = require('./src/serverCalls.js')
const messages = require('./src/clientMessages')

client.generateMessage = messages.generateMessage

module.exports = {
  client: client,
  server: server
}
