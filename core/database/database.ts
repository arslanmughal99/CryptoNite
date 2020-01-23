import * as DataStore from 'nedb';
import { app } from 'electron';
import * as fs from 'fs';
import * as path from 'path';
import { Credential } from '../../interfaces/Credential';
import { Crypto } from '../utils/crypter';

/**
 * @class Database
 * @description handle database related task including crypto
**/
export class Database extends Crypto {
  private browserWindow;
  private db: DataStore;
  private dbPath: string = path.join(app.getPath('userData'), '/cryptobase.db');

  constructor(masterKey: string, brWin) {
    super(masterKey);
    this.browserWindow = brWin;
    this.db = new DataStore({
      filename: this.dbPath,
      beforeDeserialization: (data) => this.decryptCredentials(data),
      afterSerialization: (data) => this.encryptCredentials(data),
      onload: async (err) => {
        console.log('DB LOAD ERROR: ', err);
        await this.browserWindow.sender.send('db-status',
          {
            name: err ? err.name : '',
            message: err ? err.message : '',
            stack: err ? err.stack : ''
          })
      },
      autoload: true,
      corruptAlertThreshold: 0.2
    });
  }

  /**
   * @param cred password to encrypt data
   * @description encrypt data before writin to database
   * @returns string
   */
  private encryptCredentials(cred: string): string {
    return super.encrypt(cred)
  }

  /**
   * @param cred passowrd with which data was encrypted
   * @description decrypt data after reading from database
   * @returns string
  **/
  private decryptCredentials(cred: string): string {
    return super.decrypt(cred)
  }

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
  public reload() {
    this.db.loadDatabase();
  }

  /**
   * @param credential Credential Object
   * @description Insert one credential to database
  **/
  public insertOne(credential: Credential) {
    return new Promise((resove, reject) => {
      this.db.insert(credential, err => {
        if (err) throw reject(err);
        resove();
      });
    })
  }

  /**
   * @returns Prmoise<Credential[]>
   * @description Get all credntials from database
  **/
  public getAll(): Promise<Credential[]> {
    return new Promise((resolve, reject) => {
      this.db.find({}, (err, allCredentials) => {
        if (err) reject(err);
        resolve(allCredentials as Credential[]);
      });

    })
  }

  /**
   * @param id string id for the credential to remove
   * @description This will remove the credential from database permently
  **/
  public delete(id: string) {
    return new Promise((resolve, reject) => {
      this.db.remove({ _id: id }, (err, _) => {
        if (err) reject(err);
        // this.compactDatabasae();
        resolve();
      });
    })
  }

  /**
   * @param dest destination path to copy backup file
   * @description create backup of database file which can be restore latter
   * @returns Promise<void>
  **/
  public backupDB(dest: string): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        fs.copyFileSync(this.dbPath, path.join(dest, '/cryptobase.bak'))
        resolve();
      } catch (err) {
        reject(err);
      }
    });
  }

  /**
   * @param from path of database file
   * @description restore database file
   * @returns Promise<void>
  **/
  public restoreDB(from: string): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        fs.copyFileSync(from, this.dbPath);
        resolve();
      } catch (err) {
        reject(err);
      }
    })
  }

}
