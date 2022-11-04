var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { NodeAlgorithmsMap, WebAlgorithmsMap } from "./enums";
export function nodeHmac(secret, counter, algorithm) {
    return __awaiter(this, void 0, void 0, function* () {
        let _algorithm = NodeAlgorithmsMap[algorithm] || NodeAlgorithmsMap["sha-1"];
        return new Uint8Array((yield import("crypto"))
            .createHmac(_algorithm, Buffer.from(secret))
            .update(convertIntegerIntoByteBuffer(counter))
            .digest());
    });
}
export function browserHmac(secret, counter, algorithm) {
    return __awaiter(this, void 0, void 0, function* () {
        let _algorithm = WebAlgorithmsMap[algorithm] || WebAlgorithmsMap["sha-1"];
        let crypto = window.crypto;
        let key = yield crypto.subtle.importKey("raw", new TextEncoder().encode(secret), {
            name: "HMAC",
            hash: {
                name: _algorithm,
            },
        }, false, ["sign"]);
        return new Uint8Array(yield crypto.subtle.sign({
            name: "HMAC",
            hash: {
                name: _algorithm,
            },
        }, key, convertIntegerIntoByteBuffer(counter)));
    });
}
export function convertIntegerIntoByteBuffer(integer) {
    let hexInteger = padZeroStart(integer.toString(16), 16);
    let bytes = [];
    for (let counter = 0; counter < hexInteger.length; counter += 2) {
        bytes.push(parseInt(hexInteger.substring(counter, counter + 2), 16));
    }
    return new Int8Array(bytes);
}
export function padZeroStart(source, length) {
    while (source.length < length) {
        source = "0" + source;
    }
    return source;
}
export function isNodeEnv() {
    try {
        return !!global;
    }
    catch (_a) {
        return false;
    }
}
