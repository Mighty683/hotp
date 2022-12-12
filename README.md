# HOTP-TS

Typescript implementation of:

- [`HOTP: An HMAC-Based One-Time Password Algorithm`](https://www.rfc-editor.org/rfc/rfc4226)
- [`TOTP: Time-Based One-Time Password Algorithm`](https://www.rfc-editor.org/rfc/rfc6238)
- [`OCRA: OATH Challenge-Response Algorithm`](https://www.rfc-editor.org/rfc/rfc6287) (Partial support only)

Works both in `node` and `browser` environment.

## Usage

Install:

`npm install hotp-ts`

#### HOTP

```ts
import { generateHOTP } from "hotp-ts";

let hotp = generateHOTP("some-secret-to-share-with-server", 0);
```

#### TOTP

```ts
import { generateTOTP } from "hotp-ts";

let totp = generateTOTP("some-secret-to-share-with-server", {
  timestamp: Date.now(),
});
```

#### OCRA

OCRA for now has support of:

- Numeric question
- Pin sha
- Counter

Missing support:

- Session data
- Timer data

```ts
import { generateOCRA } from "hotp-ts";

let ocraResponse = generateOCRA("secret", {
  suite: "OCRA-1:HOTP-SHA256-8:QN08-PSHA1",
  question: "00000000",
  passwordHash: "7110eda4d09e062aa5e4a390b0a572ac0d2c0220",
});
```
