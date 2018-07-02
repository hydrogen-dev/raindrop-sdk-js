const common = require('./commonCalls')

class RaindropPartner extends common.BasicPartner {}

RaindropPartner.prototype.whitelist = function (addressToWhitelist) {
  var options = {
    method: 'POST',
    body: {address: addressToWhitelist}
  }

  return this.callHydroAPI(`/whitelist`, options)
}

RaindropPartner.prototype.requestChallenge = function (hydroAddressId) {
  var options = {
    method: 'POST',
    body: {
      hydro_address_id: hydroAddressId
    }
  }

  return this.callHydroAPI('/challenge', options)
}

RaindropPartner.prototype.authenticate = function (hydroAddressId) {
  var options = {
    method: 'GET',
    qs: {
      hydro_address_id: hydroAddressId
    }
  }

  var receivedVerboseValue = this.verbose
  this.verbose = true

  return this.callHydroAPI('/authenticate', options)
    .then(result => {
      this.verbose = receivedVerboseValue
      return { authenticated: true, data: result }
    })
    .catch(error => {
      this.verbose = receivedVerboseValue
      if (error.statusCode === 401) {
        return { authenticated: false }
      } else {
        throw new common.RaindropError(`The call failed. ${error.statusCode} error: ${error.message}.`)
      }
    })
}

module.exports = {
  RaindropPartner: RaindropPartner
}
