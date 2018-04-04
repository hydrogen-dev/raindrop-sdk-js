const requestPromise = require('request-promise-native')

var verbose = false
var nodeCryptoAvailable = false
var browserCryptoAvailable = false

var crypto

function encodeBasicAuth (userName, key) {
  let base64Encoded = Buffer.from(`${userName}:${key}`).toString('base64')
  return `Basic ${base64Encoded}`
}

function initializeCrypto () {
  try {
    crypto = require('crypto')
    nodeCryptoAvailable = true
  } catch (error) {
    try {
      crypto = window.crypto || window.msCrypto
      browserCryptoAvailable = true
    } catch (error) {}
  }
}

function generateChallenge () {
  var challenge
  if (nodeCryptoAvailable) {
    challenge = generateChallengeNode()
  } else if (browserCryptoAvailable) {
    challenge = generateChallengeBrowser()
  } else {
    throw new Error('Crypto support disabled.')
  }
  if ((typeof challenge === 'string' || challenge instanceof String) & (/^[0-9]{6}$/.test(challenge))) {
    return challenge
  } else {
    throw new Error('Internal error, please contact this package\'s maintainer.')
  }
}

function generateChallengeNode () {
  var challenge
  do {
    // to get a csprn in [0, 1e6) we need 20 random bits, so we get 3 random bytes := 24 bits and shift off 4 bits
    challenge = crypto.randomBytes(3).readUIntBE(0, 3) >> 4
  } while (challenge >= 1e6) // repeat if number >= 1e6, to maintain a uniform distribution
  return challenge.toString().padStart(6, '0')
}

function generateChallengeBrowser () {
  var uints
  var challenges
  do {
    // using Uint32Array(1) won't work because bitwise operations convert to signed 32 bit Ints, leading to overflows
    uints = new Uint16Array(2)
    crypto.getRandomValues(uints)
    // to get two csprns in [0, 1e3) they need 10 random bits each, so we get 10 = 16-6 bytes per uint16
    challenges = uints.map(u => { return u >> 6 })
  } while (!challenges.every(u => { return u < 1e3 })) // repeat if numbers >= 1e3, to maintain a uniform distribution
  return Array.from(challenges).map(u => { return u.toString().padStart(3, '0') }).join('')
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
        console.error(`User registration failed. Details:\n`)
        throw error
      } else {
        if (error.statusCode === 400) {
          throw new Error(`User registration failed. Have you already registered this user?`)
        } else {
          throw new Error(`User registration failed. ${error.statusCode} error: ${error.body}.`)
        }
      }
    })
}

function verifySignature (hydroUserName, hydroKey, hydroApplicationId, challengedUserName, challengeString) {
  var options = {
    method: 'GET',
    url: 'https://dev.hydrogenplatform.com/hydro/v1/verify_signature',
    qs: {
      username: challengedUserName,
      msg: challengeString,
      application_id: hydroApplicationId
    },
    headers: {
      Authorization: encodeBasicAuth(hydroUserName, hydroKey)
    },
    json: true
  }

  return requestPromise(options)
    .then(result => {
      return result['verified']
    })
    .catch(error => {
      if (verbose) {
        console.error(`Signature verification failed. Details:\n`)
        throw error
      } else {
        throw new Error(`Signature verification failed. ${error.statusCode} error: ${error.body}.`)
      }
    })
}

function setVerbose (flag) {
  verbose = flag
}

initializeCrypto()

module.exports = {
  registerUser: registerUser,
  generateChallenge: generateChallenge,
  verifySignature: verifySignature,
  setVerbose: setVerbose
}
