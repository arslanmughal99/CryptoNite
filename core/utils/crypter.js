"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Crypto = void 0;
var crypto = require("crypto");
var Crypto = /** @class */ (function () {
    function Crypto(key) {
        this.key = key;
        this.encryptor = crypto.createCipher('aes-256-gcm', this.key);
        this.decryptor = crypto.createDecipher('aes-256-gcm', this.key);
    }
    // Encrypt Data and return promise
    Crypto.prototype.encrypt = function (data) {
        try {
            var enc = this.encryptor.update(data, 'utf8', 'hex');
            return enc;
        }
        catch (err) {
            // This will handled automatically in Database Class
        }
    };
    // Decrypt Data and return promise
    Crypto.prototype.decrypt = function (data) {
        try {
            var dec = this.decryptor.update(data, 'hex', 'utf8');
            return dec;
        }
        catch (err) {
            // This will handled automatically in Database Class
        }
    };
    return Crypto;
}());
exports.Crypto = Crypto;
//# sourceMappingURL=crypter.js.map