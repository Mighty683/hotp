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
