# Hydro Raindrop
This package provides a suite of convenience functions intended to simplify the integration of Hydro's [Raindrop authentication](https://www.hydrogenplatform.com/hydro) into your project. An equivalent [Python SDK](https://github.com/hydrogen-dev/raindrop-sdk-python) is also available. Raindrop is available in two flavors:


## Enterprise Raindrop
Enterprise Raindrop is an enterprise-level security protocol to secure APIs. The open-source code powering Enterprise Raindrop is available [here](https://github.com/hydrogen-dev/smart-contracts/tree/master/hydro-token-and-raindrop-enterprise). For more information, please refer to the [Enterprise Raindrop documentation](https://www.hydrogenplatform.com/docs/hydro/v1/#Raindrop).


## Client Raindrop
Client Raindrop is a next-gen 2FA solution. The open-source code powering Client Raindrop is available [here](https://github.com/hydrogen-dev/smart-contracts/tree/master/raindrop-client).


## Installation
### Recommended
Install [raindrop on npm](https://www.npmjs.com/package/@hydrogenplatform/raindrop):
```
npm install -S @hydrogenplatform/raindrop
```

### Manual
You can also install manually:
- `git clone https://github.com/hydrogen-dev/raindrop-sdk-js.git`
- `cd raindrop-sdk-js`
- `npm install`

### In a Browser
A webpacked version is in [/webpack/raindrop_bundle.js](./webpack/raindrop_bundle.js) that you can include in an HTML page:
```
<html>
  <body>
    <script src="raindrop_bundle.js"></script>
  </body>
</html>
```


## Usage
The `raindrop` package exposes two objects: `raindrop.client` and `raindrop.enterprise`. To authenticate your API calls, you'll need to instantiate a `RaindropPartner` object for each module, and set the environment by calling `setOptions` (see [the docs](https://www.hydrogenplatform.com/docs/hydro/v1/#Testnet) for more information on setting the environment):
```
const raindrop = require("@hydrogenplatform/raindrop")

// Client Raindrop Initialization
const ClientRaindropPartner = new raindrop.client.RaindropPartner({
    hydroKey: <YOUR_KEY>,
    hydroUserName: <YOUR_USER_NAME>
})

ClientRaindropPartner.setOptions({
  verbose: true,
  environment: 'Sandbox'
})

// Enterprise Raindrop Initialization
const EnterpriseRaindropPartner = new raindrop.enterprise.RaindropPartner({
    hydroKey: <YOUR_KEY>,
    hydroUserName: <YOUR_USER_NAME>,
    hydroApplicationId: <YOUR_APPLICATION_ID>
})

EnterpriseRaindropPartner.setOptions({
  verbose: false,
  environment: 'Production'
})
```


## Generic `RaindropPartner` Functions
### constructor `new RaindropPartner(config)`
- `config`:
  - `hydroKey` (required): Your key for the hydro API
  - `hydroUserName` (required): Your username for the hydro API
  - `hydroApplicationId` (required for `client` calls): Your application ID for the Hydro API

### `RaindropPartnerObject.setOptions(options)`
- `options`:
  - environment (required): Sets environment to `Sandbox` | `Production`
  - verbose (optional): `true` | `false` turns more detailed error reporting on | off


## `raindrop.client.RaindropPartner` Functions

### `generateMessage()`
Generates a random 6-digit string of integers for users to sign. Uses system-level CSPRNG.

Returns:
- A string of 6 random integers

### `registerUser(newUserName)`
Should be called when a user elects to use Raindrop Client for the first time with your application.
- `newUserName`: the new user's Hydro username (the one they used when signing up for Hydrogen 2FA app, visible in-app)

Returns:
- `createDate`: time when the user registered with your application
- `username`: the user's Hydro username
- `application_client_mapping_id`: a uuid identifying the user's link with your application
- `application_id`: your `hydroApplicationId`.

### `verifySignature(challengeUserName, challengeString)`
Should be called each time you need to verify whether a user has signed a message.
- `challengeUserName`: the username of the user that is meant to have signed `challengeString`
- `challengeString`: a message generated from `generateMessage()`

Returns:
- `verified`: boolean indicating whether the user has signed `challengeString`

## `raindrop.enterprise.RaindropPartner` Functions
### `whitelist(addressToWhitelist)`
A one-time call that whitelists a user to authenticate with your API via Enterprise raindrop.
- `addressToWhitelist`: The Ethereum address of the user you're whitelisting

Returns:
- `hydro_address_id`: this value **must** be stored and passed in all future calls involving this user

### `requestChallenge(hydroAddressId)`
Initiate an authentication attempt on behalf of the user associated with `hydroAddressId`.
- `hydroAddressId`: the `hydro_address_id` of the authenticating user.

Returns:
- `amount`: Quantity of Hydro tokens the user associated with hydroAddressId is required to send to the authentication smart contract
- `challenge`: A randomly generated number used to confirm the validity of the transaction
- `partner_id`: The partner ID of the calling API, the same for all authentication requests with this API

### `authenticate(hydroAddressId)`
Checks whether the user correctly performed the raindrop.
- `hydroAddressId`: the `hydro_address_id` of the user who claims to be authenticated.

Returns:
- `verified`: A boolean indicating whether or not the user should be allowed to proceed with any further authentication requests

## Copyright & License
Copyright 2018 The Hydrogen Technology Corporation under the GNU General Public License v3.0.
