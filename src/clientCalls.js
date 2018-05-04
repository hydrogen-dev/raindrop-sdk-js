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

RaindropPartner.prototype.registerUser = function (newUserName) {
  var options = {
    method: 'POST',
    qs: {
      username: newUserName,
      application_id: this.hydroApplicationId
    }
  }

  return this.callHydroAPI('/application/client', options)
}

RaindropPartner.prototype.verifySignature = function (challengeUserName, challengeString) {
  var options = {
    method: 'GET',
    qs: {
      msg: challengeString,
      username: challengeUserName,
      application_id: this.hydroApplicationId
    }
  }

  return this.callHydroAPI('/verify_signature', options)
}

RaindropPartner.prototype.unregisterUser = function (userName) {
  this.ensureInitialized()

  var options = {
    method: 'DELETE',
    qs: {
      username: userName,
      application_id: this.hydroApplicationId
    }
  }

  return this.callHydroAPI('/application/client', options)
}

module.exports = {
  RaindropPartner: RaindropPartner
}
