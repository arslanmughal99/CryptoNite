"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
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
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var electron_1 = require("electron");
var database_1 = require("../database/database");
var constants_1 = require("../constants/constants");
var updatePassword_1 = require("./../database/updatePassword");
exports.default = (function () {
    // to hold database instance
    var database;
    // Initilize Database and try decrypt db with given password
    electron_1.ipcMain.handle(constants_1.INIT_DATABASE_CHNL, function (event, password) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            database = new database_1.Database(password, event);
            return [2 /*return*/];
        });
    }); });
    // Update password for database encryption
    electron_1.ipcMain.handle(constants_1.UPDATE_PASS_CHNL, function (event, newPassword) {
        try {
            updatePassword_1.default(newPassword, database.getAll(), event);
            return;
        }
        catch (err) {
            return err;
        }
    });
    // Inset new credntial to database
    electron_1.ipcMain.handle(constants_1.INSERT_DATABASE_CHNL, function (event, credential) { return __awaiter(_this, void 0, void 0, function () {
        var err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, database.insertOne(credential)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
                case 2:
                    err_1 = _a.sent();
                    return [2 /*return*/, err_1];
                case 3: return [2 /*return*/];
            }
        });
    }); });
    // Get all credntial from database
    electron_1.ipcMain.handle(constants_1.GETALL_DATABASE_CHNL, function (event) { return __awaiter(_this, void 0, void 0, function () {
        var allCred, err_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, database.getAll()];
                case 1:
                    allCred = _a.sent();
                    return [2 /*return*/, allCred];
                case 2:
                    err_2 = _a.sent();
                    return [2 /*return*/, 'ERR'];
                case 3: return [2 /*return*/];
            }
        });
    }); });
    // Delete credntial from database
    electron_1.ipcMain.handle(constants_1.DELETE_CRED_DATABASE_CHNL, function (event, id) { return __awaiter(_this, void 0, void 0, function () {
        var err_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, database.delete(id)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
                case 2:
                    err_3 = _a.sent();
                    return [2 /*return*/, err_3];
                case 3: return [2 /*return*/];
            }
        });
    }); });
    // Create backup of database file
    electron_1.ipcMain.handle(constants_1.BACKUP_CRED_DATABASE_CHNL, function (event, path) { return __awaiter(_this, void 0, void 0, function () {
        var status_1, err_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, database.backupDB(path)];
                case 1:
                    status_1 = _a.sent();
                    return [2 /*return*/, status_1];
                case 2:
                    err_4 = _a.sent();
                    return [2 /*return*/, err_4];
                case 3: return [2 /*return*/];
            }
        });
    }); });
    // Restore backup from backup file
    electron_1.ipcMain.handle(constants_1.RESTORE_CRED_DATABASE_CHNL, function (event, path) { return __awaiter(_this, void 0, void 0, function () {
        var status_2, err_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, database.restoreDB(path)];
                case 1:
                    status_2 = _a.sent();
                    database.reload();
                    return [2 /*return*/, status_2];
                case 2:
                    err_5 = _a.sent();
                    return [2 /*return*/, err_5];
                case 3: return [2 /*return*/];
            }
        });
    }); });
});
//# sourceMappingURL=ipcHandler.js.map