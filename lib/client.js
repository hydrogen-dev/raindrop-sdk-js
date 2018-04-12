const crypto = require('crypto')
const requestPromise = require('request-promise-native')

const common = require('./common')
const RaindropError = common.RaindropError
const encodeBasicAuth = common.encodeBasicAuth
const polyfillArrayFrom = common.polyfillArrayFrom

function generateMessage () {
  try {
    if (crypto.randomBytes) {
      return generateMessageNode()
    } else {
      return generateMessageBrowser()
    }
  } catch (error) {
    if (verbose) {
      throw error
    } else {
      throw new RaindropError(`Message generation failed. Crypto support is unavailable.`)
    }
  }
}

function generateMessageBrowser () {
  var uints
  var challenges
  do {
    // using Uint32Array(1) won't work because bitwise operations convert to signed 32 bit ints, leading to overflows
    uints = new Uint16Array(2)
    window.crypto.getRandomValues(uints)
    // to get two csprns in [0, 1e3) they need 10 random bits each, so we get 10 = 16-6 bytes per uint16
    challenges = uints.map(u => { return u >> 6 })
  } while (!challenges.every(u => { return u < 1e3 })) // repeat if numbers >= 1e3, to maintain a uniform distribution

  return Array.from(challenges).map(u => { return u.toString().padStart(3, '0') }).join('')
}

function generateMessageNode () {
  var challenge
  do {
    // to get a csprn in [0, 1e6) we need 20 random bits, so we get 3 random bytes := 24 bits and shift off 4 bits
    challenge = crypto.randomBytes(3).readUIntBE(0, 3) >> 4
  } while (challenge >= 1e6) // repeat if number >= 1e6, to maintain a uniform distribution
  return challenge.toString().padStart(6, '0')
}

function registerUser (hydroUserName, hydroKey, hydroApplicationId, newUserName) {
  var options = {
    method: 'POST',
    url: 'https://dev.hydrogenplatform.com/hydro/v1/application/client',
    qs: {
      username: newUserName,
      application_id: hydroApplicationId
    },
    headers: {
      Authorization: encodeBasicAuth(hydroUserName, hydroKey)
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
        throw new RaindropError(`User registration failed. ${error.statusCode} error: ${error.message}.`)
      }
    })
}

function verifySignature (hydroUserName, hydroKey, hydroApplicationId, challengeUserName, challengeString) {
  var options = {
    method: 'GET',
    url: 'https://dev.hydrogenplatform.com/hydro/v1/verify_signature',
    qs: {
      msg: challengeString,
      username: challengeUserName,
      application_id: hydroApplicationId
    },
    headers: {
      Authorization: encodeBasicAuth(hydroUserName, hydroKey)
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
        throw new RaindropError(`Signature verification failed. ${error.statusCode} error: ${error.message}.`)
      }
    })
}

var verbose = false

function setVerbose (flag) {
  verbose = flag
}

polyfillArrayFrom()

module.exports = {
  generateMessage: generateMessage,
  registerUser: registerUser,
  verifySignature: verifySignature,
  setVerbose: setVerbose
}
