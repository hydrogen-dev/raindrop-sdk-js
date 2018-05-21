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

  return this.callHydroAPI('/authenticate', options)
}

module.exports = {
  RaindropPartner: RaindropPartner
}
