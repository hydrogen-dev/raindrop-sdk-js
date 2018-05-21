const common = require('./commonCalls')

class RaindropPartner extends common.BasicPartner {
  constructor (config) {
    if (!config.applicationId) {
      throw new common.RaindropError('Please provide your applicationId in the config: {: ..., ...}')
    }
    let clientConfig = Object.assign({}, config)
    delete config.applicationId

    super(config)

    this.applicationId = clientConfig.applicationId
  }
}

RaindropPartner.prototype.registerUser = function (newUsername) {
  var options = {
    method: 'POST',
    body: {
      username: newUsername,
      application_id: this.applicationId
    }
  }

  return this.callHydroAPI('/application/client', options)
}

RaindropPartner.prototype.verifySignature = function (challengeUsername, challengeString) {
  var options = {
    method: 'GET',
    qs: {
      msg: challengeString,
      username: challengeUsername,
      application_id: this.applicationId
    }
  }

  return this.callHydroAPI('/verify_signature', options)
}

RaindropPartner.prototype.unregisterUser = function (username) {
  var options = {
    method: 'DELETE',
    qs: {
      username: username,
      application_id: this.applicationId
    }
  }

  return this.callHydroAPI('/application/client', options)
}

module.exports = {
  RaindropPartner: RaindropPartner
}
