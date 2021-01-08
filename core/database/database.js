"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
exports.Database = void 0;
var fs = require("fs");
var path = require("path");
var electron_1 = require("electron");
var DataStore = require("nedb");
var crypter_1 = require("../utils/crypter");
/**
 * @class Database
 * @description handle database related task including crypto
**/
var Database = /** @class */ (function (_super) {
    __extends(Database, _super);
    function Database(masterKey, brWin) {
        var _this = _super.call(this, masterKey) || this;
        _this.dbPath = path.join(electron_1.app.getPath('userData'), '/cryptobase.db');
        _this.browserWindow = brWin;
        _this.db = new DataStore({
            filename: _this.dbPath,
            beforeDeserialization: function (data) { return _this.decryptCredentials(data); },
            afterSerialization: function (data) { return _this.encryptCredentials(data); },
            onload: function (err) { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            console.log('DB LOAD ERROR: ', err);
                            return [4 /*yield*/, this.browserWindow.sender.send('db-status', {
                                    name: err ? err.name : '',
                                    message: err ? err.message : '',
                                    stack: err ? err.stack : ''
                                })];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); },
            autoload: true,
            corruptAlertThreshold: 0.2
        });
        return _this;
    }
    /**
     * @param cred password to encrypt data
     * @description encrypt data before writin to database
     * @returns string
     */
    Database.prototype.encryptCredentials = function (cred) {
        return _super.prototype.encrypt.call(this, cred);
    };
    /**
     * @param cred passowrd with which data was encrypted
     * @description decrypt data after reading from database
     * @returns string
    **/
    Database.prototype.decryptCredentials = function (cred) {
        return _super.prototype.decrypt.call(this, cred);
    };
    // FIXME: Tried a lot to handle onLoad with this but no luck
    // TODO: Handle this latter
    // private dbOnLoad(err) {
    // }
    // FIXME: compacting database was causing issue
    // FIXME: it was currpting database file and causing all data to be loose
    // FIXME: There fore i decided to remove that
    /**
    * @description compact database base file (read NEDB docs for more)
    * @returns void
    **/
    // compactDatabasae(): void {
    //   this.db.persistence.compactDatafile();
    // }
    /**
     *  @description Reload database
    **/
    Database.prototype.reload = function () {
        this.db.loadDatabase();
    };
    /**
     * @param credential Credential Object
     * @description Insert one credential to database
    **/
    Database.prototype.insertOne = function (credential) {
        var _this = this;
        return new Promise(function (resove, reject) {
            _this.db.insert(credential, function (err) {
                if (err)
                    throw reject(err);
                resove();
            });
        });
    };
    /**
     * @returns Prmoise<Credential[]>
     * @description Get all credntials from database
    **/
    Database.prototype.getAll = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.db.find({}, function (err, allCredentials) {
                if (err)
                    reject(err);
                resolve(allCredentials);
            });
        });
    };
    /**
     * @param id string id for the credential to remove
     * @description This will remove the credential from database permently
    **/
    Database.prototype.delete = function (id) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.db.remove({ _id: id }, function (err, _) {
                if (err)
                    reject(err);
                // this.compactDatabasae();
                resolve();
            });
        });
    };
    /**
     * @param dest destination path to copy backup file
     * @description create backup of database file which can be restore latter
     * @returns Promise<void>
    **/
    Database.prototype.backupDB = function (dest) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            try {
                fs.copyFileSync(_this.dbPath, path.join(dest, '/cryptobase.bak'));
                resolve();
            }
            catch (err) {
                reject(err);
            }
        });
    };
    /**
     * @param from path of database file
     * @description restore database file
     * @returns Promise<void>
    **/
    Database.prototype.restoreDB = function (from) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            try {
                fs.copyFileSync(from, _this.dbPath);
                resolve();
            }
            catch (err) {
                reject(err);
            }
        });
    };
    return Database;
}(crypter_1.Crypto));
exports.Database = Database;
//# sourceMappingURL=database.js.map