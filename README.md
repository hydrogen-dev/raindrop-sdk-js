# Hydro Raindrop
This package provides a suite of convenience functions intended to simplify the integration of Hydro's [Raindrop authentication](https://www.hydrogenplatform.com/hydro) into your project. An equivalent [Python SDK](https://github.com/hydrogen-dev/raindrop-sdk-python) is also available. More information, including detailed API documentation, is available in the [Raindrop documentation](https://www.hydrogenplatform.com/docs/hydro/v1/#Raindrop). Raindrop comes in two flavors:

## Client-side Raindrop
Client-side Raindrop is a next-gen 2FA solution. We've open-sourced the [code powering Client-side Raindrop](https://github.com/hydrogen-dev/smart-contracts/tree/master/raindrop-client).


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

### In a Browser
A webpacked version is in [/dist/raindropBundle.js](./dist/raindropBundle.js) that you can include in an HTML page. Since your Hydro API credentials **must not** be stored in the frontend, this version exposes a global `raindrop` object with only a single method that does not call the Hydro API: `generateMessage` (see below for details).

```html
<script src="raindropBundle.js"></script>
```


## Usage
The `raindrop` package exposes two objects: `raindrop.client` and `raindrop.server`. To authenticate your API calls, you'll need to instantiate a `RaindropPartner` object for the module you'd like to use, and set the environment by calling `initialize` (see [the Raindrop docs](https://www.hydrogenplatform.com/docs/hydro/v1/#Environment) for information on what it means to set your environment):

```javascript
const raindrop = require("@hydrogenplatform/raindrop")
```

## Generic `RaindropPartner` Functions
### constructor `new RaindropPartner(config)`
To instantiate a new RaindropPartner object in the `client` or `server` modules, you must pass a config object with the following values:
- `config`
  - `hydroKey` (required): Your key for the Hydro API
  - `hydroUserName` (required): Your username for the Hydro API
  - `hydroApplicationId` (required for `client` calls): Your application ID for the Hydro API

### `RaindropPartnerObject.initialize(options)`
You will also need to call `initialize` on each RaindropPartner object to set the environment:
- `options`
  - `environment` (required): Sets environment to `Sandbox` | `Production`
  - `verbose` (optional): `true` | `false` turns more detailed error reporting on | off

### `RaindropPartnerObject.refreshToken()`
Refreshes OAuth token. Called automatically by `initialize`.

### `RaindropPartnerObject.transactionStatus(transactionHash)`
This function returns true when the transaction referenced by `transactionHash` has been included in a block on the Ethereum blockchain (Rinkeby if the environment is `Sandbox`, Mainnet if the environment is `Production`).
- `transactionHash` (required): Hash of a transaction

## `raindrop.client` Functions

### `generateMessage()`
Generates a random 6-digit string of integers for users to sign. Uses system-level CSPRNG.

## `raindrop.client.RaindropPartner` Functions
Client-side Raindrop initialization code will look like:

```javascript
// Client-side Raindrop Setup
const ClientRaindropPartner = new raindrop.client.RaindropPartner({
    hydroKey: "YOUR_KEY",
    hydroUserName: "YOUR_USER_NAME",
    hydroApplicationId: "YOUR_APPLICATION_ID"
})

ClientRaindropPartner.initialize({ environment: 'Sandbox' })
```

### `registerUser(hydroUsername)`
Should be called when a user elects to use Raindrop Client for the first time with your application.
- `hydroUsername`: the new user's Hydro username (the one they used when signing up for Hydro mobile app)

### `verifySignature(hydroUsername, message)`
Should be called each time you need to verify whether a user has signed a message.
- `hydroUsername`: the username of the user that is meant to have signed `message`
- `message`: a message generated from `generateMessage()` (or any 6-digit numeric code)

### `unregisterUser(hydroUsername)`
Should be called when a user disables Client-side Raindrop with your application.
- `hydroUsername`: the user's Hydro username (the one they used when signing up for Hydro mobile app)

## `raindrop.server.RaindropPartner` Functions
Server-side Raindrop initialization code will look like:

```javascript
// Server-side Raindrop Setup
const ServerRaindropPartner = new raindrop.server.RaindropPartner({
    hydroKey: "YOUR_KEY",
    hydroUserName: "YOUR_USER_NAME"
})

ServerRaindropPartner.initialize({ environment: 'Sandbox' })
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
