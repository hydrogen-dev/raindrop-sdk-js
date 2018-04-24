const requestPromise = require('request-promise-native')

const common = require('./common_calls')

class RaindropPartner extends common.BasicPartner {}

RaindropPartner.prototype.whitelist = function (addressToWhitelist) {
  this.ensureEnvironmentSet()

  var options = {
    method: 'GET',
    url: `${this.apiURL}/whitelist/${addressToWhitelist}`,
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
        throw new common.RaindropError(`Whitelist request failed. ${error.statusCode} error: ${error.message}.`)
      }
    })
}

RaindropPartner.prototype.requestChallenge = function (hydroAddressId) {
  this.ensureEnvironmentSet()

  var options = {
    method: 'GET',
    url: `${this.apiURL}/challenge`,
    qs: {
      hydro_address_id: hydroAddressId
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
        throw new common.RaindropError(`Challenge request failed. ${error.statusCode} error: ${error.message}.`)
      }
    })
}

RaindropPartner.prototype.authenticate = function (hydroAddressId) {
  this.ensureEnvironmentSet()

  var options = {
    method: 'GET',
    url: `${this.apiURL}/authenticate`,
    qs: {
      hydro_address_id: hydroAddressId
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
        throw new common.RaindropError(`Authentication request failed. ${error.statusCode} error: ${error.message}.`)
      }
    })
}

module.exports = {
  RaindropPartner: RaindropPartner
}
