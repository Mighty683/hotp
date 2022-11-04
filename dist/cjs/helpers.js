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
Object.defineProperty(exports, "__esModule", { value: true });
exports.isNodeEnv = exports.padZeroStart = exports.convertIntegerIntoByteBuffer = exports.browserHmac = exports.nodeHmac = void 0;
var enums_1 = require("./enums");
function nodeHmac(secret, counter, algorithm) {
    return __awaiter(this, void 0, void 0, function () {
        var _algorithm, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _algorithm = enums_1.NodeAlgorithmsMap[algorithm] || enums_1.NodeAlgorithmsMap["sha-1"];
                    _a = Uint8Array.bind;
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("crypto"); })];
                case 1: return [2 /*return*/, new (_a.apply(Uint8Array, [void 0, (_b.sent())
                            .createHmac(_algorithm, Buffer.from(secret))
                            .update(convertIntegerIntoByteBuffer(counter))
                            .digest()]))()];
            }
        });
    });
}
exports.nodeHmac = nodeHmac;
function browserHmac(secret, counter, algorithm) {
    return __awaiter(this, void 0, void 0, function () {
        var _algorithm, crypto, key, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _algorithm = enums_1.WebAlgorithmsMap[algorithm] || enums_1.WebAlgorithmsMap["sha-1"];
                    crypto = window.crypto;
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
                        }, key, convertIntegerIntoByteBuffer(counter))];
                case 2: return [2 /*return*/, new (_a.apply(Uint8Array, [void 0, _b.sent()]))()];
            }
        });
    });
}
exports.browserHmac = browserHmac;
function convertIntegerIntoByteBuffer(integer) {
    var hexInteger = padZeroStart(integer.toString(16), 16);
    var bytes = [];
    for (var counter = 0; counter < hexInteger.length; counter += 2) {
        bytes.push(parseInt(hexInteger.substring(counter, counter + 2), 16));
    }
    return new Int8Array(bytes);
}
exports.convertIntegerIntoByteBuffer = convertIntegerIntoByteBuffer;
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
