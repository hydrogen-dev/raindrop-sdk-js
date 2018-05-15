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

class BasicPartner {
  constructor (config) {
    // check that the passed names are valid...
    let requiredOptions = ['clientId', 'clientSecret', 'environment']
    let optionalOptions = ['verbose']
    let acceptableOptions = requiredOptions.concat(optionalOptions)

    if (!Object.keys(config).every(x => acceptableOptions.includes(x))) {
      throw new RaindropError(`Invalid option. Valid options are: ${acceptableOptions.toString()}`)
    }

    if (!requiredOptions.every(x => x in config)) {
      throw new RaindropError(`Missing option. Please include all of: ${requiredOptions.toString()}`)
    }

    this.clientId = config.clientId
    this.clientSecret = config.clientSecret

    this[setEnvironment](config.environment)
    if (config.verbose !== undefined) {
      this[setVerbose](config.verbose)
    }

    this.initialized = this.refreshToken()
      .then(result => { this.initialized = result })
  }

  [setEnvironment] (environment) {
    let allowedValues = {
      Sandbox: 'https://sandbox.hydrogenplatform.com',
      Production: 'https://api.hydrogenplatform.com'
    }

    if (!(environment in allowedValues)) {
      throw new RaindropError(
        `Invalid 'environment' value: Allowed options are: ${Object.keys(allowedValues).toString()}`
      )
    }

    this.environment = environment
    this.apiURL = allowedValues[environment]
  }

  [setVerbose] (flag) {
    let allowedValues = [true, false]
    if (!allowedValues.includes(flag)) {
      throw new RaindropError(`Invalid 'verbose' value: Allowed options are: ${allowedValues.toString()}`)
    }
    this.verbose = flag
  }

  [ensureInitialized] () {
    if (!this.initialized) {
      throw new RaindropError(
        'Error fetching OAuth token. Check that your credentials were entered correctly, and try calling ' +
        'refreshToken() manually. If the problem persists, please file a Github issue.')
    }
  }

  refreshToken () {
    var options = {
      method: 'POST',
      timeout: 10000, // 10 seconds
      url: `${this.apiURL}/authorization/v1/oauth/token`,
      qs: { grant_type: 'client_credentials' },
      headers: { Authorization: encodeBasicAuth(this.clientId, this.clientSecret) },
      json: true
    }

    return requestPromise(options)
      .then(result => {
        this.OAuthToken = result.access_token
        return true
      })
      .catch(() => {
        return false
      })
  }

  async callHydroAPI (endpoint, options) {
    await this.initialized
    this[ensureInitialized]()

    // inject url and authorization
    options.headers = { Authorization: `Bearer ${this.OAuthToken}` }
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
      qs: { transaction_hash: transactionHash }
    }

    return this.callHydroAPI('/transaction', options)
  }
}

module.exports = {
  BasicPartner: BasicPartner,
  RaindropError: RaindropError
}
