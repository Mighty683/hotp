# HOTP-TS

Typescript implementation of:

- [`HOTP: An HMAC-Based One-Time Password Algorithm`](https://www.rfc-editor.org/rfc/rfc4226)
- [`TOTP: Time-Based One-Time Password Algorithm`](https://www.rfc-editor.org/rfc/rfc6238)
- [`OCRA: OATH Challenge-Response Algorithm`](https://www.rfc-editor.org/rfc/rfc6287)

Works both in `node` and `browser` environment.

## Usage

Install:

`npm install hotp-ts`

#### HOTP

```ts
import { generateHOTP } from "hotp-ts";

let hotp = await generateHOTP("some-secret-to-share-with-server", 0);
```

#### TOTP

```ts
import { generateTOTP } from "hotp-ts";

let totp = await generateTOTP("some-secret-to-share-with-server", {
  timestamp: Date.now(),
});
```

#### OCRA

```ts
import { generateOCRA } from "hotp-ts";

let ocraResponse = await generateOCRA("secret", {
  suite: "OCRA-1:HOTP-SHA256-8:QN08-PSHA1",
  question: "00000000",
  passwordHash: "7110eda4d09e062aa5e4a390b0a572ac0d2c0220",
});
```
