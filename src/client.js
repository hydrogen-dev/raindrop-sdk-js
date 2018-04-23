const requestPromise = require('request-promise-native')

const common = require('./common')
const message = require('./message.js')

class RaindropPartner extends common.BasicPartner {
  constructor (config) {
    super(config)
    if (!config.hydroApplicationId) {
      throw new common.RaindropError(`Please provide your ApplicationId in the config: {hydroApplicationId: ..., ...}`)
    }
  }
}

RaindropPartner.prototype.registerUser = function (newUserName) {
  this.ensureEnvironmentSet()

  var options = {
    method: 'POST',
    url: `${this.apiURL}/application/client`,
    qs: {
      username: newUserName,
      application_id: this.hydroApplicationId
    },
    headers: {
      Authorization: common.encodeBasicAuth(this.hydroUserName, this.hydroKey)
    },
    json: true
  }

  return requestPromise(options)
    .then(result => {
      return result
    })
    .catch(error => {
      if (this.verbose) {
        throw error
      } else {
        throw new common.RaindropError(`User registration failed. ${error.statusCode} error: ${error.message}.`)
      }
    })
}

RaindropPartner.prototype.verifySignature = function (challengeUserName, challengeString) {
  this.ensureEnvironmentSet()

  var options = {
    method: 'GET',
    url: `${this.apiURL}/verify_signature`,
    qs: {
      msg: challengeString,
      username: challengeUserName,
      application_id: this.hydroApplicationId
    },
    headers: {
      Authorization: common.encodeBasicAuth(this.hydroUserName, this.hydroKey)
    },
    json: true
  }

  return requestPromise(options)
    .then(result => {
      return result
    })
    .catch(error => {
      if (common.getVerbose()) {
        throw error
      } else {
        throw new common.RaindropError(`Signature verification failed. ${error.statusCode} error: ${error.message}.`)
      }
    })
}

module.exports = {
  RaindropPartner: RaindropPartner,
  generateMessage: message.generateMessage
}
