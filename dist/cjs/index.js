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
exports.generateOCRA = exports.generateHOTP = exports.generateTOTP = void 0;
var helpers_1 = require("./helpers");
var enums_1 = require("./enums");
/**
 *
 * TOTP: Time-Based One-Time Password Algorithm
 * https://www.rfc-editor.org/rfc/rfc6238
 * @param secret - shared secret between client and server; each HOTP
  generator has a different and unique secret K.
 * @param options.t0 - is the Unix time to start counting time steps, default 0
 * @param options.timestamp - Unix time for which we will generate TOTP
 * @param options.digitsCount - number of digits generated by TOTP, default 6
 * @param options.stepTime - time in seconds how long step is valid, default 30
 * @returns
 */
function generateTOTP(secret, options) {
    return __awaiter(this, void 0, void 0, function () {
        var stepTime, _t0, stepCounter;
        return __generator(this, function (_a) {
            stepTime = options.stepTime || 30;
            _t0 = options.t0 || 0;
            stepCounter = Math.floor((options.timestamp - _t0) / 1000 / stepTime);
            return [2 /*return*/, generateHOTP(secret, stepCounter, options)];
        });
    });
}
exports.generateTOTP = generateTOTP;
/**
 * HOTP: An HMAC-Based One-Time Password Algorithm
 * https://www.rfc-editor.org/rfc/rfc4226
 * @param secret - shared secret between client and server; each HOTP
  generator has a different and unique secret K.
 * @param counter - integer counter value, the moving factor.  This counter
    MUST be synchronized between the HOTP generator (client)
    and the HOTP validator (server).
 * @param options.digitsCount - length of generated HOTP, default 6
 * @param options.algorithm - algorithm used possible values: sha-1, sha-256, default: sha-1
  
 * @returns
 */
function generateHOTP(secret, counter, options) {
    return __awaiter(this, void 0, void 0, function () {
        var hmacResult, digitsCount, codeValue, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, helpers_1.hmac)(secret, counter, options === null || options === void 0 ? void 0 : options.algorithm)];
                case 1:
                    hmacResult = _a.sent();
                    digitsCount = (options === null || options === void 0 ? void 0 : options.digitsCount) || 6;
                    codeValue = (0, helpers_1.dynamicTruncate)(hmacResult) % Math.pow(10, digitsCount);
                    result = codeValue.toString();
                    return [2 /*return*/, (0, helpers_1.padZeroStart)(result, digitsCount)];
            }
        });
    });
}
exports.generateHOTP = generateHOTP;
/**
 * OCRA: OATH Challenge-Response Algorithm
 * https://www.rfc-editor.org/rfc/rfc6287
 *
 * @param options.question - number or string or ByteArray
 * if string can be alphanumerical or number string eg: "00000000"
 * depends on question type.
 */
function generateOCRA(secret, options) {
    return __awaiter(this, void 0, void 0, function () {
        var OCRAConfig, dataInput, hmacResult, codeValue, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    OCRAConfig = (0, helpers_1.parseOCRASuite)(options.suite);
                    dataInput = (0, helpers_1.createOCRADataInput)(options, OCRAConfig);
                    return [4 /*yield*/, (0, helpers_1.hmac)(secret, dataInput, enums_1.OCRAAlgorithmMap[OCRAConfig.algorithm])];
                case 1:
                    hmacResult = _a.sent();
                    codeValue = (0, helpers_1.dynamicTruncate)(hmacResult) % Math.pow(10, OCRAConfig.digitsCount);
                    result = codeValue.toString();
                    return [2 /*return*/, (0, helpers_1.padZeroStart)(result, OCRAConfig.digitsCount)];
            }
        });
    });
}
exports.generateOCRA = generateOCRA;
