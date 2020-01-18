import * as crypto from 'crypto';

export class Crypto {
  private key: string;
  private encryptor: crypto.CipherGCM;
  private decryptor: crypto.DecipherGCM;

  constructor(key) {
    this.key = key;
    this.encryptor = crypto.createCipher('aes-256-gcm', this.key);
    this.decryptor = crypto.createDecipher('aes-256-gcm', this.key);
  }

  // Encrypt Data and return promise
  public encrypt(data: string): string {
    try {
      const enc = this.encryptor.update(data, 'utf8', 'hex');
      return enc;
    } catch (err) {
      // This will handled automatically in Database Class
    }
  }

  // Decrypt Data and return promise
  public decrypt(data: string): string {
    try {
      const dec = this.decryptor.update(data, 'hex', 'utf8');
      return dec;
    } catch (err) {
      // This will handled automatically in Database Class
    }
  }

}
