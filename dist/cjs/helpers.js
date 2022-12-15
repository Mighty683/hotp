"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createOCRADataInput = exports.parseOCRASuite = exports.hmac = exports.dynamicTruncate = exports.isNodeEnv = exports.padZeroStart = exports.integerToByteArray = exports.hexStringToByteArray = exports.stringToByteArray = exports.browserHmac = exports.nodeHmac = void 0;
var enums_1 = require("./enums");
function nodeHmac(secret, input, algorithm) {
    return __awaiter(this, void 0, void 0, function () {
        var _algorithm, byteArray, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _algorithm = enums_1.NodeAlgorithmsMap[algorithm] || enums_1.NodeAlgorithmsMap["sha-1"];
                    byteArray = typeof input === "number" ? integerToByteArray(input) : input;
                    _a = Uint8Array.bind;
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("crypto"); })];
                case 1: return [2 /*return*/, new (_a.apply(Uint8Array, [void 0, (_b.sent())
                            .createHmac(_algorithm, Buffer.from(secret))
                            .update(byteArray)
                            .digest()]))()];
            }
        });
    });
}
exports.nodeHmac = nodeHmac;
function browserHmac(secret, input, algorithm) {
    return __awaiter(this, void 0, void 0, function () {
        var _algorithm, crypto, byteArray, key, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _algorithm = enums_1.WebAlgorithmsMap[algorithm] || enums_1.WebAlgorithmsMap["sha-1"];
                    crypto = window.crypto;
                    byteArray = typeof input === "number" ? integerToByteArray(input) : input;
                    return [4 /*yield*/, crypto.subtle.importKey("raw", new TextEncoder().encode(secret), {
                            name: "HMAC",
                            hash: {
                                name: _algorithm,
                            },
                        }, false, ["sign"])];
                case 1:
                    key = _b.sent();
                    _a = Uint8Array.bind;
                    return [4 /*yield*/, crypto.subtle.sign({
                            name: "HMAC",
                            hash: {
                                name: _algorithm,
                            },
                        }, key, byteArray)];
                case 2: return [2 /*return*/, new (_a.apply(Uint8Array, [void 0, _b.sent()]))()];
            }
        });
    });
}
exports.browserHmac = browserHmac;
function stringToByteArray(source) {
    var bytes = new Uint8Array(source.length);
    for (var i = 0; i < source.length; i++) {
        bytes.set([source.charCodeAt(i)], i);
    }
    return bytes;
}
exports.stringToByteArray = stringToByteArray;
function hexStringToByteArray(source) {
    var bytes = new Uint8Array(source.length / 2);
    for (var i = 0; i < source.length; i += 2) {
        bytes.set([parseInt(source.slice(i, i + 2).toUpperCase(), 16)], i / 2);
    }
    return bytes;
}
exports.hexStringToByteArray = hexStringToByteArray;
function integerToByteArray(integer, byteSize) {
    if (byteSize === void 0) { byteSize = 8; }
    var hexInteger = padZeroStart(integer.toString(16), byteSize * 2);
    var bytes = new Uint8Array(byteSize);
    for (var counter = 0; counter < hexInteger.length; counter += 2) {
        bytes.set([parseInt(hexInteger.substring(counter, counter + 2), byteSize * 2)], counter / 2);
    }
    return bytes;
}
exports.integerToByteArray = integerToByteArray;
function padZeroStart(source, length) {
    while (source.length < length) {
        source = "0" + source;
    }
    return source;
}
exports.padZeroStart = padZeroStart;
function isNodeEnv() {
    try {
        return !!global;
    }
    catch (_a) {
        return false;
    }
}
exports.isNodeEnv = isNodeEnv;
function dynamicTruncate(source) {
    var offset = source[source.byteLength - 1] & 0xf;
    return (((source[offset] & 0x7f) << 24) |
        ((source[offset + 1] & 0xff) << 16) |
        ((source[offset + 2] & 0xff) << 8) |
        (source[offset + 3] & 0xff));
}
exports.dynamicTruncate = dynamicTruncate;
function hmac(secret, input, algorithm) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if (isNodeEnv()) {
                return [2 /*return*/, nodeHmac(secret, input, algorithm)];
            }
            else {
                return [2 /*return*/, browserHmac(secret, input, algorithm)];
            }
            return [2 /*return*/];
        });
    });
}
exports.hmac = hmac;
function parseOCRASuite(suite) {
    var suiteParts = suite.split(":");
    // Algorithm
    var suiteAlgorithmParts = suiteParts[1].split("-");
    var algorithm = suiteAlgorithmParts[1];
    var digitsCount = parseInt(suiteAlgorithmParts[2]);
    // Question
    var suiteQuestionDataParts = suiteParts[2].split("-");
    var counterEnabled = suiteQuestionDataParts.includes("C");
    var suiteQuestionPart = suiteQuestionDataParts[counterEnabled ? 1 : 0];
    var questionType = suiteQuestionPart[1];
    var questionLength = parseInt(suiteQuestionPart.match(/\d+/)[0]);
    // Data
    var dataInput = suiteQuestionDataParts[counterEnabled ? 2 : 1];
    var timerEnabled = dataInput === null || dataInput === void 0 ? void 0 : dataInput.startsWith("T1M");
    return {
        algorithm: algorithm,
        digitsCount: digitsCount,
        questionType: questionType,
        questionLength: questionLength,
        dataInput: dataInput,
        timerEnabled: timerEnabled,
        counterEnabled: counterEnabled,
    };
}
exports.parseOCRASuite = parseOCRASuite;
function createOCRADataInput(_a, config) {
    var suite = _a.suite, question = _a.question, counter = _a.counter, session = _a.session, passwordHash = _a.passwordHash, timestamp = _a.timestamp;
    var suiteByteArray = stringToByteArray(suite);
    var questionByteArray;
    if (typeof question === "number") {
        questionByteArray = integerToByteArray(question, enums_1.OCRA_QUESTION_BYTE_LENGTH);
    }
    else if (typeof question === "string") {
        if (config.questionType === "A") {
            questionByteArray = new Uint8Array(enums_1.OCRA_QUESTION_BYTE_LENGTH);
            questionByteArray.set(stringToByteArray(question), 0);
        }
        else if (config.questionType === "N") {
            questionByteArray = new Uint8Array(enums_1.OCRA_QUESTION_BYTE_LENGTH);
            questionByteArray.set(hexStringToByteArray(parseInt(question, 10).toString(16).padEnd(128, "0")), 0);
        }
    }
    else {
        questionByteArray = new Uint8Array(enums_1.OCRA_QUESTION_BYTE_LENGTH);
        questionByteArray.set(question, 0);
    }
    var separatorByteArray = new Int8Array([0]);
    var counterArray = config.counterEnabled &&
        typeof counter === "number" &&
        integerToByteArray(counter);
    var sessionArray = session && stringToByteArray(session);
    var passwordArray = passwordHash && hexStringToByteArray(passwordHash);
    var timestampArray = config.timerEnabled &&
        timestamp &&
        (typeof timestamp === "number"
            ? integerToByteArray(timestamp)
            : stringToByteArray(padZeroStart(timestamp, 16)));
    var dataInput = new Uint8Array(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray([], __read(suiteByteArray), false), __read((separatorByteArray || [])), false), __read((counterArray || [])), false), __read((questionByteArray || [])), false), __read((passwordArray || [])), false), __read((sessionArray || [])), false), __read((timestampArray || [])), false));
    return dataInput;
}
exports.createOCRADataInput = createOCRADataInput;
