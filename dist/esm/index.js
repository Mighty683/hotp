var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
/**
 * @param secret - shared secret between client and server; each HOTP
  generator has a different and unique secret K.
 * @param options.t0 - is the Unix time to start counting time steps, default 0
 * @param options.timestamp - Unix time for which we will generate TOTP
 * @param options.digitsCount - number of digits generated by TOTP, default 6
 * @param options.stepTime - time in seconds how long step is valid, default 30
 * @returns
 */
export function generateTOTP(secret, options) {
    return __awaiter(this, void 0, void 0, function* () {
        let stepTime = options.stepTime || 30;
        let _t0 = options.t0 || 0;
        let stepCounter = Math.floor((options.timestamp - _t0) / 1000 / stepTime);
        return generateHOTP(secret, stepCounter, options);
    });
}
/**
 * HOTP: An HMAC-Based One-Time Password Algorithm
 * https://www.rfc-editor.org/rfc/rfc4226
 * @param secret - shared secret between client and server; each HOTP
  generator has a different and unique secret K.
 * @param counter - integer counter value, the moving factor.  This counter
    MUST be synchronized between the HOTP generator (client)
    and the HOTP validator (server).
 * @param options.digitsCount - length of generated HOTP, default 6
 }
 * @returns
 */
export function generateHOTP(secret, counter, options) {
    return __awaiter(this, void 0, void 0, function* () {
        let hmacResult = yield hmac(secret, counter);
        let digitsCount = (options === null || options === void 0 ? void 0 : options.digitsCount) || 6;
        let codeValue = dynamicTruncate(hmacResult) % Math.pow(10, digitsCount);
        let result = codeValue.toString();
        return padZeroStart(result, digitsCount);
    });
}
function dynamicTruncate(source) {
    let offset = source[source.byteLength - 1] & 0xf;
    return (((source[offset] & 0x7f) << 24) |
        ((source[offset + 1] & 0xff) << 16) |
        ((source[offset + 2] & 0xff) << 8) |
        (source[offset + 3] & 0xff));
}
function hmac(secret, counter) {
    return __awaiter(this, void 0, void 0, function* () {
        if (global) {
            return (yield import("crypto"))
                .createHmac("sha1", Buffer.from(secret))
                .update(convertIntegerIntoByteBuffer(counter))
                .digest();
        }
        else {
            let crypto = window.crypto;
            let key = yield crypto.subtle.importKey("raw", new TextEncoder().encode(secret), {
                name: "HMAC",
                hash: {
                    name: "SHA-1",
                },
            }, false, ["sign"]);
            return crypto.subtle.sign({
                name: "HMAC",
                hash: {
                    name: "SHA-1",
                },
            }, key, convertIntegerIntoByteBuffer(counter));
        }
    });
}
function convertIntegerIntoByteBuffer(integer) {
    let hexInteger = padZeroStart(integer.toString(16), 16);
    let bytes = [];
    for (let counter = 0; counter < hexInteger.length; counter += 2) {
        bytes.push(parseInt(hexInteger.substring(counter, counter + 2), 16));
    }
    return new Int8Array(bytes);
}
function padZeroStart(source, length) {
    while (source.length < length) {
        source = "0" + source;
    }
    return source;
}