const crypto = require('crypto')
const requestPromise = require('request-promise-native')

var verbose = false

function encodeBasicAuth (userName, key) {
  let base64Encoded = Buffer.from(`${userName}:${key}`).toString('base64')
  return `Basic ${base64Encoded}`
}

function generateChallenge () {
  var challenge
  do {
    // we want a csprn in [0, 1e6), meaning we need 20 random bits, we get 3 random bytes := 24 bits, and shift off 4 bits
    challenge = crypto.randomBytes(3).readUIntBE(0, 3) >> 4
  } while (challenge >= 1e6) // repeat as necessary if the number is >=1e6, to maintain a uniform distribution

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

module.exports = {
  registerUser: registerUser,
  generateChallenge: generateChallenge,
  verifySignature: verifySignature,
  setVerbose: setVerbose
}
