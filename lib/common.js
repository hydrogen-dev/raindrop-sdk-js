const createError = require('create-error')

var environment
let environmentToUrl = {
  'Dev': 'https://dev.hydrogenplatform.com/hydro/v1',
  'Sandbox': 'https://sandbox.hydrogenplatform.com/hydro/v1',
  'Production': 'https://api.hydrogenplatform.com/hydro/v1'
}
var verbose = false

function setVerbose (flag) {
  verbose = flag
}

function getVerbose (flag) {
  return verbose
}

function setEnvironment (newEnvironment) {
  if (!(newEnvironment in environmentToUrl)) {
    throw new Error(`Provided environment must be one of: ${Object.keys(environmentToUrl).toString()}`)
  }
  environment = newEnvironment
}

function getEnvironment () {
  return environment
}

function ensureEnvironmentSet () {
  if (environment === undefined) {
    throw new RaindropError(
      `You must set an environment first. Please call setEnvironment with one of: ` +
      `${Object.keys(environmentToUrl).toString()}`
    )
  }
}

function getHydroURL () {
  return environmentToUrl[environment]
}

const RaindropError = createError('RaindropError', {
  code: 'RaindropError'
})

function encodeBasicAuth (userName, key) {
  let base64Encoded = Buffer.from(`${userName}:${key}`).toString('base64')
  return `Basic ${base64Encoded}`
}

module.exports = {
  setVerbose: setVerbose,
  getVerbose: getVerbose,
  setEnvironment: setEnvironment,
  getEnvironment: getEnvironment,
  ensureEnvironmentSet: ensureEnvironmentSet,
  getHydroURL: getHydroURL,
  RaindropError: RaindropError,
  encodeBasicAuth: encodeBasicAuth
}
