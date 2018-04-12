# Hydro Raindrop
This package provides a suite of convenience functions intended to simplify the integration of Hydro's [Raindrop authentication](https://www.hydrogenplatform.com/hydro) into your project. Raindrop is available in two flavors:

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
The `raindrop` package exposes two objects: `raindrop.enterprise` and `raindrop.client`. Before being able to use `raindrop.enterprise`, you must set your desired environment: `raindrop.enterprise.setEnvironment('Sandbox'|'Production')` (see the [docs](https://www.hydrogenplatform.com/docs/hydro/v1/#Testnet) for more information). In each module, calling `setVerbose(true)` will result in slightly more detailed error messages.

## `enterprise` Functions
### `setEnvironment`
### `getEnvironment`
### `whitelist`
### `requestChallenge`
### `authenticate`
### `setVerbose`

## `client` Functions
### `generateMessage`
### `registerUser`
### `verifySignature`
### `setVerbose`

## Copyright & License
Copyright 2018 The Hydrogen Technology Corporation under the GNU General Public License v3.0.
