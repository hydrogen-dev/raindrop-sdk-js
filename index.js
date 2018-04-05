const crypto = require('crypto')
const createError = require('create-error')
const requestPromise = require('request-promise-native')

const RaindropError = createError('RaindropError', {
  code: 'RaindropError'
})

var verbose = false

function setVerbose (flag) {
  verbose = flag
}

function polyfillArrayFrom () {
// Production steps of ECMA-262, Edition 6, 22.1.2.1
  if (!Array.from) {
    Array.from = (function () {
      var toStr = Object.prototype.toString
      var isCallable = function (fn) {
        return typeof fn === 'function' || toStr.call(fn) === '[object Function]'
      }
      var toInteger = function (value) {
        var number = Number(value)
        if (isNaN(number)) { return 0 }
        if (number === 0 || !isFinite(number)) { return number }
        return (number > 0 ? 1 : -1) * Math.floor(Math.abs(number))
      }
      var maxSafeInteger = Math.pow(2, 53) - 1
      var toLength = function (value) {
        var len = toInteger(value)
        return Math.min(Math.max(len, 0), maxSafeInteger)
      }

      // The length property of the from method is 1.
      return function from (arrayLike/*, mapFn, thisArg */) {
        // 1. Let C be the this value.
        var C = this

        // 2. Let items be ToObject(arrayLike).
        var items = Object(arrayLike)

        // 3. ReturnIfAbrupt(items).
        if (arrayLike == null) {
          throw new TypeError('Array.from requires an array-like object - not null or undefined')
        }

        // 4. If mapfn is undefined, then let mapping be false.
        var mapFn = arguments.length > 1 ? arguments[1] : void undefined
        var T
        if (typeof mapFn !== 'undefined') {
          // 5. else
          // 5. a If IsCallable(mapfn) is false, throw a TypeError exception.
          if (!isCallable(mapFn)) {
            throw new TypeError('Array.from: when provided, the second argument must be a function')
          }

          // 5. b. If thisArg was supplied, let T be thisArg; else let T be undefined.
          if (arguments.length > 2) {
            T = arguments[2]
          }
        }

        // 10. Let lenValue be Get(items, "length").
        // 11. Let len be ToLength(lenValue).
        var len = toLength(items.length)

        // 13. If IsConstructor(C) is true, then
        // 13. a. Let A be the result of calling the [[Construct]] internal method
        // of C with an argument list containing the single item len.
        // 14. a. Else, Let A be ArrayCreate(len).
        var A = isCallable(C) ? Object(new C(len)) : new Array(len)

        // 16. Let k be 0.
        var k = 0
        // 17. Repeat, while k < len… (also steps a - h)
        var kValue
        while (k < len) {
          kValue = items[k]
          if (mapFn) {
            A[k] = typeof T === 'undefined' ? mapFn(kValue, k) : mapFn.call(T, kValue, k)
          } else {
            A[k] = kValue
          }
          k += 1
        }
        // 18. Let putStatus be Put(A, "length", len, true).
        A.length = len
        // 20. Return A.
        return A
      }
    }())
  }
}

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
    // using Uint32Array(1) won't work because bitwise operations convert to signed 32 bit Ints, leading to overflows
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

function encodeBasicAuth (userName, key) {
  let base64Encoded = Buffer.from(`${userName}:${key}`).toString('base64')
  return `Basic ${base64Encoded}`
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
        if (error.statusCode === 400) {
          throw new RaindropError(`User registration failed. Have you already registered this user?`)
        } else {
          throw new RaindropError(`User registration failed. ${error.statusCode} error: ${error.body}.`)
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
        throw error
      } else {
        throw new RaindropError(`Signature verification failed. ${error.statusCode} error: ${error.body}.`)
      }
    })
}

polyfillArrayFrom()

module.exports = {
  setVerbose: setVerbose,
  generateMessage: generateMessage,
  registerUser: registerUser,
  verifySignature: verifySignature
}
