# Hydro Raindrop
This package provides a suite of convenience functions intended to simplify the integration of Hydro's [Raindrop authentication](https://www.hydrogenplatform.com/hydro) into your project. An equivalent [Python SDK](https://github.com/hydrogen-dev/raindrop-sdk-python) is also available. Raindrop is available in two flavors:

## Raindrop Enterprise
Raindrop Enterprise is an enterprise-level security protocol to secure APIs. The open-source code powering Raindrop enterprise is available [here](https://github.com/hydrogen-dev/smart-contracts/tree/master/hydro-token-and-raindrop-enterprise). For more information, please refer to the [Raindrop Enterprise documentation](https://www.hydrogenplatform.com/docs/hydro/v1/#Raindrop).

## Raindrop Client
Raindrop Client is an innovative next-gen 2FA solution. The open-source code powering Raindrop enterprise is available [here](https://github.com/hydrogen-dev/smart-contracts/tree/master/raindrop-client).

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
A browserified version is in [/browserify/raindrop.js](./browserify/raindrop.js) that you can include in an HTML page:
```
<html>
  <body>
    <script src="raindrop.js"></script>
  </body>
</html>
```

## Getting started
The `raindrop` package exposes two main objects: `raindrop.enterprise` and `raindrop.client` and two helper functions.

## Helper Functions
### `setEnvironment(newEnvironment)`
You must set the environment before any functions that hit the Hydrogen API can be called. See the [docs](https://www.hydrogenplatform.com/docs/hydro/v1/#Testnet) for more information about what this means.
- `newEnvironment`: `'Sandbox'` or `'Production'`

### `setVerbose(flag)`
Turns on more verbose error reporting.
- `flag`: `true` | `false`

## `enterprise` Functions
### `whitelist(hydroUserName, hydroKey, addressToWhitelist)`
A one-time call that whitelists a user to authenticate with Enterprise raindrop.
- `hydroUserName`: Your username for the Hydro API
- `hydroKey`: Your key for the Hydro API
- `addressToWhitelist`: The Ethereum address of the user you're whitelisting

Returns:
- `hydro_address_id`: this value **must** be stored and passed in all future calls involving this user

### `requestChallenge(hydroUserName, hydroKey, hydroAddressId)`
Calling this functions initiates an authentication attempt on behalf of the user associated with `hydroAddressId`.
- `hydroUserName`: Your username for the Hydro API
- `hydroKey`: Your key for the Hydro API
- `hydroAddressId`: hydro_address_id from the previous `whitelist` call.

Returns:
- `amount`: Quantity of Hydro tokens the user associated with hydroAddressId must send to the blockchain
- `challenge`: Randomly generated string used to confirm the validity of the transaction
- `partner_id`: The caller's partner ID, the same for all authentication requests

### `authenticate(hydroUserName, hydroKey, hydroAddressId)`
Checks whether the user correctly performed the raindrop
- `hydroUserName`: Your username for the Hydro API
- `hydroKey`: Your key for the Hydro API
- `hydroAddressId`: hydro_address_id from the previous `whitelist` call

Returns:
- `verified`: A boolean indicating whether or not the user should be able to proceed

## `client` Functions
### `generateMessage()`
Generates a random 6-digit string of integers for users to sign. Uses system-level CSPRNG.

Returns:
- A string of 6 random integers

### `registerUser(hydroUserName, hydroKey, hydroApplicationId, newUserName)`
This function should be called once when a user is signing up for Raindrop Client `hydroAddressId`.
- `hydroUserName`: Your username for the hydro API
- `hydroKey`: Your key for the hydro API
- `hydroApplicationId`: Your application ID for the Hydro API
- `newUserName`: the username of the new user that they used when signing up for the Hydrogen 2FA app

Returns:
- `createDate`: time when the user registered with this application
- `username`: the username
- `application_client_mapping_id`: a uuid identifying the user's link with this application
- `application_id`: the same as `hydroApplicationId`.

### `verifySignature(hydroUserName, hydroKey, hydroApplicationId, challengeUserName, challengeString)`
This function should be called whenever you need to verify whether a user has signed a message.
- `hydroUserName`: Your username for the hydro API
- `hydroKey`: Your key for the hydro API
- `hydroApplicationId`: Your application ID for the Hydro API
- `challengeUserName`: the username of the new user that claims to have signed `challengeString`
- `challengeString`: a message generated from `generateMessage()`

Returns:
- `verified`: boolean indicating whether the user has signed `challengeString`

## Copyright & License
Copyright 2018 The Hydrogen Technology Corporation under the GNU General Public License v3.0.
