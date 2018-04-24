const createError = require('create-error')
const requestPromise = require('request-promise-native')

const RaindropError = createError('RaindropError', {
  code: 'RaindropError'
})

function encodeBasicAuth (userName, key) {
  let base64Encoded = Buffer.from(`${userName}:${key}`).toString('base64')
  return `Basic ${base64Encoded}`
}

class BasicPartner {
  constructor (config) {
    if (!config.hydroKey) {
      throw new RaindropError('Please provide your Hydro API key in the config: {hydroKey: ..., ...}')
    }
    if (!config.hydroUserName) {
      throw new RaindropError('Please provide your Hydro API username in the config: {hydroUserName: ..., ...}')
    }
    this.hydroKey = config.hydroKey
    this.hydroUserName = config.hydroUserName

    this.verbose = false
    this.environmentSet = false
    this.environmentUrls = {
      'Dev': 'https://dev.hydrogenplatform.com/hydro/v1',
      'Sandbox': 'https://sandbox.hydrogenplatform.com/hydro/v1',
      'Production': 'https://api.hydrogenplatform.com/hydro/v1'
    }
  }

  setVerbose (flag) {
    let allowedValues = [true, false]
    if (!allowedValues.includes(flag)) {
      throw new RaindropError(`Invalid 'verbose' value: Allowed options are: ${allowedValues.toString()}`)
    }
    this.verbose = flag
  }

  setEnvironment (newEnvironment) {
    let allowedValues = Object.keys(this.environmentUrls)
    if (!allowedValues.includes(newEnvironment)) {
      throw new RaindropError(`Invalid 'environment' value: Allowed options are: ${allowedValues.toString()}`)
    }
    this.environment = newEnvironment
    this.apiURL = this.environmentUrls[newEnvironment]
    this.environmentSet = true
  }

  setOptions (options) {
    let acceptableOptions = ['verbose', 'environment']
    // check that the passed option names are valid...
    if (!Object.keys(options).every(x => acceptableOptions.includes(x))) {
      throw new RaindropError(`Allowed options are: ${acceptableOptions.toString()}`)
    }
    if ('verbose' in options) {
      this.setVerbose(options.verbose)
    }
    if ('environment' in options) {
      this.setEnvironment(options.environment)
    }
  }

  ensureEnvironmentSet () {
    if (!this.environmentSet) {
      throw new RaindropError(
        `No environment set. Call the .setOptions method with ` +
        `{environment: ${Object.keys(this.environmentUrls).map(x => `'${x}'`).join(' | ')}}`
      )
    }
  }

  transactionStatus (transactionHash) {
    this.ensureEnvironmentSet()

    var options = {
      method: 'POST',
      url: `${this.apiURL}/transaction`,
      qs: {
        transaction_hash: transactionHash
      },
      headers: {
        Authorization: encodeBasicAuth(this.hydroUserName, this.hydroKey)
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
          throw new RaindropError(`Whitelist request failed. ${error.statusCode} error: ${error.message}.`)
        }
      })
  }
}

module.exports = {
  BasicPartner: BasicPartner,
  RaindropError: RaindropError,
  encodeBasicAuth: encodeBasicAuth
}
