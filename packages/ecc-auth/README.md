# ecc-auth

What is this?

- A library that normalizes the crypto API for browser and Node.js
- A library to sign fetch requests using `secp256k1`
- A middleware to validate those signatures from `express`
- Uses the native `crypto` in the browser and the built in Node.js package

### Install

```bash
npm install --save ecc-auth
```

### Usage to authenticate requests

#### Browser

```ts
import * as ecc from "ecc-auth/browser";
import { ApiClient } from "ecc-auth/api-client";

// generate ephemeral keys
const keys = ecc.generateKeyPair();

// create client instance
const client = new ApiClient("https://my-service.menduz.com", keys, ecc);

// send signed request
await client.fetch("/me");
```

#### Node.js (express)

```ts
import { requireSignature, getContext } from "ecc-auth/middleware";

const publicKeyWhitelist = new Set<string>();

function authenticatePublicKey(request, response, next) {
  const ctx = getContext(request);

  if (publicKeyWhitelist.has(ctx.publicKey)) {
    next();
  } else {
    next("Unauthorized");
  }
}

app.get("/me", requireSignature(), authorizePublicKey, function (req, res) {
  res.send("Hi there!");
});
```

### Usage of the plain ECC functions

```ts
// from Node.js
import * as ecc from "ecc-auth/node";
// from Browser
import * as ecc from "ecc-auth/browser";

// generate keys
const keys = ecc.generateKeyPair();

const payload = toHex("Hi there!");

// sign payload
const sig = await signUint8Array(payload, keys.privateKey);

// validate signature
assert(
  true == (await isSignatureValid(sig.signature, payload, keys.publicKey))
);
```

### Exposed interface

```ts
// both 'ecc-auth/browser' and 'ecc-auth/node' modules expose the same interface

function isSignatureValid(
  signature: Uint8Array,
  message: Uint8Array,
  publicKey: Uint8Array
): Promise<boolean>;
function isSignatureValidHex(
  signatureHex: string,
  messageHex: string,
  publicKeyHex: string
): Promise<boolean>;
function validateRequestSignature(
  signatureHex: string,
  method: string,
  path: string,
  timestamp: string,
  body: string | Uint8Array | void,
  publicKeyHex: string
): Promise<void>;
function generateKeyPair(): Keys;
function getRequestSignature(
  method: string,
  path: string,
  timestamp: string,
  body: string | Uint8Array | void,
  privatekey: Uint8Array
): Promise<Signature>;
function fromHex(hexString: string): Uint8Array;
function toHex(bytes: Uint8Array): string;
function signString(message: string, key: Uint8Array): Promise<Signature>;
function signUint8Array(
  msgUint8: Uint8Array,
  key: Uint8Array
): Promise<Signature>;
function sha256string(message: string): Promise<string>;
function sha256(msgUint8: Uint8Array): Promise<string>;
```
