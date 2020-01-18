import * as path from 'path';
import * as Datastore from 'nedb';
import { Crypto } from '../utils/crypter';
import * as fs from 'fs';
import { app } from 'electron';
import { Credential } from './../../interfaces/Credential';

/**
 * @param password new password to set on database
 * @param oldItems Promise that will resolve to items already in old database
 * @param event IPC event to send back any error during process
 * @description This function will create a new database instance in temp dir and after writing new content it will copy to main database file in userData dir
**/
export default async function passUpdateHandler(password: string, oldItems: Promise<Credential[]>, event) {
  // return new Promise(async (resolve, reject) => {
  const tmpFilePath = path.join(app.getPath('temp'), 'tmpBase.db');
  try{
    fs.unlinkSync(tmpFilePath);
  } catch (err) {
    //
  }
  const crypto: Crypto = new Crypto(password);
  const tempDB = new Datastore({
    filename: tmpFilePath,
    beforeDeserialization: (data) => { return crypto.decrypt(data) },
    afterSerialization: (data) => { return crypto.encrypt(data) },
    onload: (err) => {
      event.sender.send('pass-reset-error', {
        name: err ? err.name : '',
        message: err ? err.message : '',
        stack: err ? err.stack : ''
      })
    },
    autoload: true
  });

  try {
    const oldItemsList: Credential[] = await oldItems
    const stripedItems = oldItemsList.map((each: Credential) => {
      delete each._id;
      return each;
    });

    tempDB.insert(stripedItems, (erro, docs) => {
      if (erro) {
        return erro;
      };
      try {
        fs.copyFile(tmpFilePath, path.join(app.getPath('userData'), '/cryptobase.db'), (erreno) => {
          if (erreno) throw erreno;
          fs.unlink(tmpFilePath, (err) => {
            if (err) throw err;
          });
        });
      } catch (errr) {
        return errr
      }
    });
  } catch (erre) {
    return erre;
  }
  // });

}
