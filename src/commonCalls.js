const createError = require('create-error')
const requestPromise = require('request-promise-native')

const RaindropError = createError('RaindropError', {
  code: 'RaindropError'
})

function encodeBasicAuth (id, secret) {
  let base64Encoded = Buffer.from(`${id}:${secret}`).toString('base64')
  return `Basic ${base64Encoded}`
}

const setVerbose = Symbol('setVerbose')
const setEnvironment = Symbol('setEnvironment')
const ensureInitialized = Symbol('ensureInitialized')
const ensureEnvironmentSet = Symbol('ensureEnvironmentSet')

class BasicPartner {
  constructor (config) {
    if (!config.clientId) {
      throw new RaindropError('Please provide your Hydro clientId in the config: {clientId: ..., ...}')
    }
    if (!config.clientSecret) {
      throw new RaindropError('Please provide your Hydro clientSecret in the config: {clientSecret: ..., ...}')
    }
    this.clientId = config.clientId
    this.clientSecret = config.clientSecret

    this.verbose = false
    this.initialized = false
    this.environmentSet = false
    this.environmentUrls = {
      'Sandbox': 'https://sandbox.hydrogenplatform.com',
      'Production': 'https://api.hydrogenplatform.com'
    }
  }

  [setVerbose] (flag) {
    let allowedValues = [true, false]
    if (!allowedValues.includes(flag)) {
      throw new RaindropError(`Invalid 'verbose' value: Allowed options are: ${allowedValues.toString()}`)
    }
    this.verbose = flag
  }

  [setEnvironment] (newEnvironment) {
    let allowedValues = Object.keys(this.environmentUrls)
    if (!allowedValues.includes(newEnvironment)) {
      throw new RaindropError(`Invalid 'environment' value: Allowed options are: ${allowedValues.toString()}`)
    }
    this.environment = newEnvironment
    this.apiURL = this.environmentUrls[newEnvironment]
  }

  async initialize (options) {
    let acceptableOptions = ['verbose', 'environment']
    // check that the passed option names are valid...
    if (!Object.keys(options).every(x => acceptableOptions.includes(x))) {
      throw new RaindropError(`Invalid key. Allowed options are: ${acceptableOptions.toString()}`)
    }
    if ('verbose' in options) {
      this[setVerbose](options.verbose)
    }
    if ('environment' in options) {
      this[setEnvironment](options.environment)
    }

    this.environmentSet = true

    await this.refreshToken()

    this.initialized = true
  }

  [ensureInitialized] () {
    if (!this.initialized) {
      throw new RaindropError(
        `Object has not been initialized. Call the initialize method with ` +
        `environment: ${Object.keys(this.environmentUrls).map(x => `'${x}'`).join(' | ')}`
      )
    }
  }

  [ensureEnvironmentSet] () {
    if (!this.environmentSet) {
      throw new RaindropError(
        `Environment has not been set. Call the initialize method with ` +
        `environment: ${Object.keys(this.environmentUrls).map(x => `'${x}'`).join(' | ')}`
      )
    }
  }

  async refreshToken () {
    this[ensureEnvironmentSet]()

    var options = {
      method: 'POST',
      url: `${this.apiURL}/authorization/v1/oauth/token`,
      qs: {
        grant_type: 'client_credentials'
      },
      headers: {
        Authorization: encodeBasicAuth(this.clientId, this.clientSecret)
      },
      json: true
    }

    await requestPromise(options)
      .then(result => {
        this.OAuthToken = result.access_token
      })
      .catch(error => {
        if (this.verbose) {
          throw error
        } else {
          throw new RaindropError(`Could not refresh token. ${error.statusCode} error: ${error.message}.`)
        }
      })
  }

  callHydroAPI (endpoint, options) {
    this[ensureInitialized]()

    // inject url and authorization
    options.headers = {
      Authorization: `Bearer ${this.OAuthToken}`
    }
    options.url = `${this.apiURL}/hydro/v1${endpoint}`
    options.json = true

    // return the data
    return requestPromise(options)
      .then(result => {
        return result
      })
      .catch(error => {
        if (this.verbose) {
          throw error
        } else {
          throw new RaindropError(`The call failed. ${error.statusCode} error: ${error.message}.`)
        }
      })
  }

  transactionStatus (transactionHash) {
    var options = {
      method: 'GET',
      qs: {
        transaction_hash: transactionHash
      }
    }

    return this.callHydroAPI('/transaction', options)
  }
}

module.exports = {
  BasicPartner: BasicPartner,
  RaindropError: RaindropError
}
