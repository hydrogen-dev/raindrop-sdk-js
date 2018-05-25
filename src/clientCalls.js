const common = require('./commonCalls')

class RaindropPartner extends common.BasicPartner {
  constructor (config) {
    if (!config.applicationId) {
      throw new common.RaindropError('Please provide your applicationId in the config: {applicationId: ..., ...}')
    }
    let clientConfig = Object.assign({}, config)
    delete config.applicationId

    super(config)

    this.applicationId = clientConfig.applicationId
  }
}

RaindropPartner.prototype.registerUser = function (hydroID) {
  var options = {
    method: 'POST',
    body: {
      hydro_id: hydroID,
      application_id: this.applicationId
    }
  }

  return this.callHydroAPI('/application/client', options)
}

RaindropPartner.prototype.verifySignature = function (hydroID, challengeString) {
  var options = {
    method: 'GET',
    qs: {
      message: challengeString,
      hydro_id: hydroID,
      application_id: this.applicationId
    }
  }

  return this.callHydroAPI('/verify_signature', options)
}

RaindropPartner.prototype.unregisterUser = function (hydroID) {
  var options = {
    method: 'DELETE',
    qs: {
      hydro_id: hydroID,
      application_id: this.applicationId
    }
  }

  return this.callHydroAPI('/application/client', options)
}

module.exports = {
  RaindropPartner: RaindropPartner
}
