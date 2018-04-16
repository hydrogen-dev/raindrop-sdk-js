const requestPromise = require('request-promise-native')

const common = require('./common')

function whitelist (hydroUserName, hydroKey, addressToWhitelist) {
  common.ensureEnvironmentSet()

  var options = {
    method: 'POST',
    url: `${common.getHydroURL()}/whitelist/${addressToWhitelist}`,
    body: {
      username: hydroUserName,
      key: hydroKey
    },
    json: true
  }

  return requestPromise(options)
    .then(result => {
      return result
    })
    .catch(error => {
      // todo: add further/more robust error checks
      if (common.getVerbose()) {
        throw error
      } else {
        throw new common.RaindropError(`Whitelist request failed. ${error.statusCode} error: ${error.message}.`)
      }
    })
}

function requestChallenge (hydroUserName, hydroKey, hydroAddressId) {
  common.ensureEnvironmentSet()

  var options = {
    method: 'POST',
    url: `${common.getHydroURL()}/challenge`,
    qs: {
      hydro_address_id: hydroAddressId
    },
    body: {
      username: hydroUserName,
      key: hydroKey
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
        throw new common.RaindropError(`Challenge request failed. ${error.statusCode} error: ${error.message}.`)
      }
    })
}

function authenticate (hydroUserName, hydroKey, hydroAddressId) {
  common.ensureEnvironmentSet()

  var options = {
    method: 'POST',
    url: `${common.getHydroURL()}/authenticate`,
    qs: {
      hydro_address_id: hydroAddressId
    },
    body: {
      username: hydroUserName,
      key: hydroKey
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
        throw new common.RaindropError(`Authentication request failed. ${error.statusCode} error: ${error.message}.`)
      }
    })
}

module.exports = {
  whitelist: whitelist,
  requestChallenge: requestChallenge,
  authenticate: authenticate
}
