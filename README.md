# Hydro Raindrop
This package provides a suite of convenience functions intended to simplify the integration of Hydro's [Raindrop authentication](https://www.hydrogenplatform.com/hydro) into your project. An equivalent [Python SDK](https://github.com/hydrogen-dev/raindrop-sdk-python) is also available. More information, including detailed API documentation, is available in the [Raindrop documentation](https://www.hydrogenplatform.com/docs/hydro/v1/#Raindrop). Raindrop comes in two flavors:

## Client-side Raindrop
Client-side Raindrop is a next-gen 2FA solution. We've open-sourced the [code powering Client-side Raindrop](https://github.com/hydrogen-dev/smart-contracts/tree/master/client-raindrop).


## Server-side Raindrop
Server-side Raindrop is an enterprise-level security protocol to secure APIs and other shared resources. We've open-sourced the [code powering Server-side Raindrop](https://github.com/hydrogen-dev/smart-contracts/tree/master/hydro-token-and-raindrop-enterprise).


## Installation
### Recommended
Install [raindrop on npm](https://www.npmjs.com/package/@hydrogenplatform/raindrop):
```shell
npm install -S @hydrogenplatform/raindrop
```

### Manual
You can also install manually:
- `git clone https://github.com/hydrogen-dev/raindrop-sdk-js.git`
- `cd raindrop-sdk-js`
- `npm install`


## Usage
The `raindrop` package exposes two objects: `raindrop.client` and `raindrop.server`. To start making API calls, you'll need to instantiate a `RaindropPartner` object for the module you'd like to use. The SDK will automatically fetch you an [OAuth token](https://www.hydrogenplatform.com/docs/hydro/v1/#Authentication), and set [your environment](https://www.hydrogenplatform.com/docs/hydro/v1/#Environment).

```javascript
const raindrop = require("@hydrogenplatform/raindrop")
```

## Generic `RaindropPartner` Functions
### constructor `new RaindropPartner(config)`
To instantiate a new RaindropPartner object in the `client` or `server` modules, you must pass a config object with the following values:
- `config`
  - `environment` (required): `Sandbox` | `Production` to set your environment
  - `clientId` (required): Your OAuth id for the Hydro API
  - `clientSecret` (required): Your OAuth secret for the Hydro API
  - `applicationId` (required for `client` calls): Your application id for the Hydro API
  - `verbose` (optional): `true` | `false` turns more detailed error reporting on | off

### `RaindropPartnerObject.refreshToken()`
Manually refreshes OAuth token.

### `RaindropPartnerObject.transactionStatus(transactionHash)`
This function returns true when the transaction referenced by `transactionHash` has been included in a block on the Ethereum blockchain (Rinkeby if the environment is `Sandbox`, Mainnet if the environment is `Production`).
- `transactionHash` (required): Hash of a transaction

## Generic `raindrop.client` Functions

### `generateMessage()`
Generates a random 6-digit string of integers for users to sign. Uses system-level CSPRNG.

## `raindrop.client.RaindropPartner` Functions
Client-side Raindrop initialization code will look like:

```javascript
// Client-side Raindrop Setup
const ClientRaindropPartner = new raindrop.client.RaindropPartner({
    environment: "Sandbox",
    clientId: "yourId",
    clientSecret: "yourSecret",
    applicationId: "yourApplicationId"
})
```

### `registerUser(HydroID)`
Should be called when a user elects to use Raindrop Client for the first time with your application.
- `HydroID`: the new user's HydroID (the one they used when signing up for Hydro mobile app)

### `verifySignature(HydroID, message)`
Should be called each time you need to verify whether a user has signed a message.
- `HydroID`: the HydroID of the user that is meant to have signed `message`
- `message`: a message generated from `generateMessage()` (or any 6-digit numeric code)

### `unregisterUser(HydroID)`
Should be called when a user disables Client-side Raindrop with your application.
- `HydroID`: the user's HydroID (the one they used when signing up for Hydro mobile app)

## `raindrop.server.RaindropPartner` Functions
Server-side Raindrop initialization code will look like:

```javascript
// Server-side Raindrop Setup
const ServerRaindropPartner = new raindrop.server.RaindropPartner({
  environment: "Sandbox",
  clientId: "yourId",
  clientSecret: "yourSecret"
})
```

### `whitelist(addressToWhitelist)`
A one-time call that whitelists a user to authenticate with your API via Server-side Raindrop.
- `addressToWhitelist`: The Ethereum address of the user you're whitelisting

### `requestChallenge(hydroAddressId)`
Initiate an authentication attempt on behalf of the user associated with `hydroAddressId`.
- `hydroAddressId`: the `hydro_address_id` of the authenticating user

### `authenticate(hydroAddressId)`
Checks whether the user correctly performed the raindrop.
- `hydroAddressId`: the `hydro_address_id` of the user who claims to be authenticated

## Copyright & License
Copyright 2018 The Hydrogen Technology Corporation under the MIT License.
