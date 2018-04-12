const requestPromise = require('request-promise-native')

const common = require('./common')
const RaindropError = common.RaindropError

var hydroURL
var environment

function setEnvironment (newEnvironment) {
  let urls = {
    'Sandbox': 'https://sandbox.hydrogenplatform.com/hydro/v1',
    'Production': 'https://api.hydrogenplatform.com/hydro/v1'
  }

  if (!(newEnvironment in urls)) {
    throw new Error('Provided environment must be \'Sandbox\' or \'Production\'')
  }

  hydroURL = urls[newEnvironment]
  environment = newEnvironment
}

function getEnvironment () {
  return environment
}

function ensureEnvironmentSet () {
  if (environment === undefined) {
    throw new RaindropError('You must set an environment first. Please call setEnvironment(\'Sandbox\'|\'Production\')')
  }
}

function whitelist (hydroUserName, hydroKey, addressToWhitelist) {
  ensureEnvironmentSet()

  var options = {
    method: 'POST',
    url: `${hydroURL}/whitelist/${addressToWhitelist}`,
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
      if (verbose) {
        throw error
      } else {
        throw new RaindropError(`Whitelist request failed. ${error.statusCode} error: ${error.message}.`)
      }
    })
}

function requestChallenge (hydroUserName, hydroKey, hydroAddressId) {
  ensureEnvironmentSet()

  var options = {
    method: 'POST',
    url: `${hydroURL}/challenge`,
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
      if (verbose) {
        throw error
      } else {
        throw new RaindropError(`Challenge request failed. ${error.statusCode} error: ${error.message}.`)
      }
    })
}

function authenticate (hydroUserName, hydroKey, hydroAddressId) {
  ensureEnvironmentSet()

  var options = {
    method: 'POST',
    url: `${hydroURL}/authenticate`,
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
      if (verbose) {
        throw error
      } else {
        throw new RaindropError(`Authentication request failed. ${error.statusCode} error: ${error.message}.`)
      }
    })
}

var verbose = false

function setVerbose (flag) {
  verbose = flag
}

module.exports = {
  setEnvironment: setEnvironment,
  getEnvironment: getEnvironment,
  whitelist: whitelist,
  requestChallenge: requestChallenge,
  authenticate: authenticate,
  setVerbose: setVerbose
}
