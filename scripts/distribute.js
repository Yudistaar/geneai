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
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
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
var hardhat_1 = require("hardhat");
var fs = require("fs");
// Helper function to send transactions with retries
function sendTransactionWithRetry(txFunc_1) {
    return __awaiter(this, arguments, void 0, function (txFunc, retries, delay // Delay before retrying in milliseconds (5s)
    ) {
        var attempt, tx, error_1;
        if (retries === void 0) { retries = 3; }
        if (delay === void 0) { delay = 5000; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    attempt = 0;
                    _a.label = 1;
                case 1:
                    if (!(attempt < retries)) return [3 /*break*/, 8];
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 5, , 7]);
                    return [4 /*yield*/, txFunc()];
                case 3:
                    tx = _a.sent();
                    return [4 /*yield*/, tx.wait()];
                case 4:
                    _a.sent();
                    return [2 /*return*/, tx];
                case 5:
                    error_1 = _a.sent();
                    console.error("Attempt ".concat(attempt + 1, " failed:"), error_1);
                    if (attempt === retries - 1) {
                        throw error_1; // Throw error after final attempt
                    }
                    attempt++;
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, delay); })];
                case 6:
                    _a.sent(); // Delay before retry
                    return [3 /*break*/, 7];
                case 7: return [3 /*break*/, 1];
                case 8: return [2 /*return*/];
            }
        });
    });
}
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var CONTRACT_ADDRESS, provider, signer, contract, data, entries, _loop_1, _i, _a, _b, index, entry;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    CONTRACT_ADDRESS = "0x9Aa6DE2EC72fb281896d848Fbb8A2F5569e2a662";
                    provider = new hardhat_1.ethers.WebSocketProvider("wss://rpc.nexus.xyz/ws");
                    signer = new hardhat_1.ethers.Wallet(process.env.PRIVATE_KEY, provider);
                    return [4 /*yield*/, hardhat_1.ethers.getContractAt("GenesisAI", CONTRACT_ADDRESS, signer)];
                case 1:
                    contract = _c.sent();
                    data = fs.readFileSync("nexus_addresses.txt", "utf-8");
                    entries = data
                        .split("\n")
                        .filter(function (line) { return line.trim(); })
                        .map(function (line) {
                        var _a = line.split(","), address = _a[0], amount = _a[1];
                        return {
                            address: address.trim(),
                            amount: hardhat_1.ethers.parseUnits(amount.trim(), 18)
                        };
                    });
                    _loop_1 = function (index, entry) {
                        var tx, error_2;
                        return __generator(this, function (_d) {
                            switch (_d.label) {
                                case 0:
                                    _d.trys.push([0, 3, , 4]);
                                    console.log("Processing ".concat(index + 1, "/").concat(entries.length, ": ").concat(entry.address));
                                    return [4 /*yield*/, sendTransactionWithRetry(function () {
                                            return contract.distribute([entry.address], [entry.amount]);
                                        })];
                                case 1:
                                    tx = _d.sent();
                                    console.log("Transaction completed: ".concat(tx.hash));
                                    // Prevent RPC overload with adjustable delay
                                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 1500); })];
                                case 2:
                                    // Prevent RPC overload with adjustable delay
                                    _d.sent(); // 1.5s delay
                                    return [3 /*break*/, 4];
                                case 3:
                                    error_2 = _d.sent();
                                    console.error("Error processing ".concat(entry.address, ":"), error_2);
                                    return [3 /*break*/, 4];
                                case 4: return [2 /*return*/];
                            }
                        });
                    };
                    _i = 0, _a = entries.entries();
                    _c.label = 2;
                case 2:
                    if (!(_i < _a.length)) return [3 /*break*/, 5];
                    _b = _a[_i], index = _b[0], entry = _b[1];
                    return [5 /*yield**/, _loop_1(index, entry)];
                case 3:
                    _c.sent();
                    _c.label = 4;
                case 4:
                    _i++;
                    return [3 /*break*/, 2];
                case 5:
                    console.log("✅ Distribution complete.");
                    return [2 /*return*/];
            }
        });
    });
}
main().catch(console.error);
