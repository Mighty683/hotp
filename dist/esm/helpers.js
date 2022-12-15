var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { NodeAlgorithmsMap, OCRA_QUESTION_BYTE_LENGTH, WebAlgorithmsMap, } from "./enums";
export function nodeHmac(secret, input, algorithm) {
    return __awaiter(this, void 0, void 0, function* () {
        let _algorithm = NodeAlgorithmsMap[algorithm] || NodeAlgorithmsMap["sha-1"];
        let byteArray = typeof input === "number" ? integerToByteArray(input) : input;
        return new Uint8Array((yield import("crypto"))
            .createHmac(_algorithm, Buffer.from(secret))
            .update(byteArray)
            .digest());
    });
}
export function browserHmac(secret, input, algorithm) {
    return __awaiter(this, void 0, void 0, function* () {
        let _algorithm = WebAlgorithmsMap[algorithm] || WebAlgorithmsMap["sha-1"];
        let crypto = window.crypto;
        let byteArray = typeof input === "number" ? integerToByteArray(input) : input;
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
        }, key, byteArray));
    });
}
export function stringToByteArray(source) {
    let bytes = new Uint8Array(source.length);
    for (let i = 0; i < source.length; i++) {
        bytes.set([source.charCodeAt(i)], i);
    }
    return bytes;
}
export function hexStringToByteArray(source) {
    let bytes = new Uint8Array(source.length / 2);
    for (let i = 0; i < source.length; i += 2) {
        bytes.set([parseInt(source.slice(i, i + 2).toUpperCase(), 16)], i / 2);
    }
    return bytes;
}
export function integerToByteArray(integer, byteSize = 8) {
    let hexInteger = padZeroStart(integer.toString(16), byteSize * 2);
    let bytes = new Uint8Array(byteSize);
    for (let counter = 0; counter < hexInteger.length; counter += 2) {
        bytes.set([parseInt(hexInteger.substring(counter, counter + 2), byteSize * 2)], counter / 2);
    }
    return bytes;
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
export function dynamicTruncate(source) {
    let offset = source[source.byteLength - 1] & 0xf;
    return (((source[offset] & 0x7f) << 24) |
        ((source[offset + 1] & 0xff) << 16) |
        ((source[offset + 2] & 0xff) << 8) |
        (source[offset + 3] & 0xff));
}
export function hmac(secret, input, algorithm) {
    return __awaiter(this, void 0, void 0, function* () {
        if (isNodeEnv()) {
            return nodeHmac(secret, input, algorithm);
        }
        else {
            return browserHmac(secret, input, algorithm);
        }
    });
}
export function parseOCRASuite(suite) {
    let suiteParts = suite.split(":");
    // Algorithm
    let suiteAlgorithmParts = suiteParts[1].split("-");
    let algorithm = suiteAlgorithmParts[1];
    let digitsCount = parseInt(suiteAlgorithmParts[2]);
    // Question
    let suiteQuestionDataParts = suiteParts[2].split("-");
    let counterEnabled = suiteQuestionDataParts.includes("C");
    let suiteQuestionPart = suiteQuestionDataParts[counterEnabled ? 1 : 0];
    let questionType = suiteQuestionPart[1];
    let questionLength = parseInt(suiteQuestionPart.match(/\d+/)[0]);
    // Data
    let dataInput = suiteQuestionDataParts[counterEnabled ? 2 : 1];
    let timerEnabled = dataInput === null || dataInput === void 0 ? void 0 : dataInput.startsWith("T1M");
    return {
        algorithm,
        digitsCount,
        questionType,
        questionLength,
        dataInput,
        timerEnabled,
        counterEnabled,
    };
}
export function createOCRADataInput({ suite, question, counter, session, passwordHash, timestamp }, config) {
    let suiteByteArray = stringToByteArray(suite);
    let questionByteArray;
    if (typeof question === "number") {
        questionByteArray = integerToByteArray(question, OCRA_QUESTION_BYTE_LENGTH);
    }
    else if (typeof question === "string") {
        if (config.questionType === "A") {
            questionByteArray = new Uint8Array(OCRA_QUESTION_BYTE_LENGTH);
            questionByteArray.set(stringToByteArray(question), 0);
        }
        else if (config.questionType === "N") {
            questionByteArray = new Uint8Array(OCRA_QUESTION_BYTE_LENGTH);
            questionByteArray.set(hexStringToByteArray(parseInt(question, 10).toString(16).padEnd(128, "0")), 0);
        }
    }
    else {
        questionByteArray = new Uint8Array(OCRA_QUESTION_BYTE_LENGTH);
        questionByteArray.set(question, 0);
    }
    let separatorByteArray = new Int8Array([0]);
    let counterArray = config.counterEnabled &&
        typeof counter === "number" &&
        integerToByteArray(counter);
    let sessionArray = session && stringToByteArray(session);
    let passwordArray = passwordHash && hexStringToByteArray(passwordHash);
    let timestampArray = config.timerEnabled &&
        timestamp &&
        (typeof timestamp === "number"
            ? integerToByteArray(timestamp)
            : stringToByteArray(padZeroStart(timestamp, 16)));
    let dataInput = new Uint8Array([
        ...suiteByteArray,
        ...(separatorByteArray || []),
        ...(counterArray || []),
        ...(questionByteArray || []),
        ...(passwordArray || []),
        ...(sessionArray || []),
        ...(timestampArray || []),
    ]);
    return dataInput;
}
