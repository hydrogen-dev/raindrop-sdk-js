const common = require('./commonCalls')

class RaindropPartner extends common.BasicPartner {
  constructor (config) {
    super(config)
    if (!config.hydroApplicationId) {
      throw new common.RaindropError(`Please provide your ApplicationId in the config: {hydroApplicationId: ..., ...}`)
    }
    this.hydroApplicationId = config.hydroApplicationId
  }
}

RaindropPartner.prototype.registerUser = function (newUsername) {
  var options = {
    method: 'POST',
    qs: {
      username: newUsername,
      application_id: this.hydroApplicationId
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
      application_id: this.hydroApplicationId
    }
  }

  return this.callHydroAPI('/verify_signature', options)
}

RaindropPartner.prototype.unregisterUser = function (username) {
  this.ensureInitialized()

  var options = {
    method: 'DELETE',
    qs: {
      username: username,
      application_id: this.hydroApplicationId
    }
  }

  return this.callHydroAPI('/application/client', options)
}

module.exports = {
  RaindropPartner: RaindropPartner
}
