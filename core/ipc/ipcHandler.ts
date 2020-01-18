import { ipcMain } from 'electron';
import { Database } from '../database/database';
import {
  UPDATE_PASS_CHNL,
  INIT_DATABASE_CHNL,
  INSERT_DATABASE_CHNL,
  GETALL_DATABASE_CHNL,
  BACKUP_CRED_DATABASE_CHNL,
  DELETE_CRED_DATABASE_CHNL,
  RESTORE_CRED_DATABASE_CHNL
} from '../constants/constants';
import { Credential } from '../../interfaces/Credential';
import passUpdateHandler from './../database/updatePassword';


export default () => {

  // to hold database instance
  let database: Database;

  // Initilize Database and try decrypt db with given password
  ipcMain.handle(INIT_DATABASE_CHNL, async (event, password: string) => {
    database = new Database(password, event) as Database;
  });

  // Update password for database encryption
  ipcMain.handle(UPDATE_PASS_CHNL,  (event, newPassword: string) => {
    try {
      passUpdateHandler(newPassword, database.getAll(), event);
      return;
    } catch (err) {
      return err
    }
  });

  // Inset new credntial to database
  ipcMain.handle(INSERT_DATABASE_CHNL, async (event, credential: Credential) => {
    try {
      await database.insertOne(credential);
      return;
    } catch (err) {
      return err;
    }
  });

  // Get all credntial from database
  ipcMain.handle(GETALL_DATABASE_CHNL, async (event) => {
    try {
      const allCred = await database.getAll();
      return allCred;
    } catch (err) {
      return 'ERR'
    }
  });

  // Delete credntial from database
  ipcMain.handle(DELETE_CRED_DATABASE_CHNL, async (event, id: string) => {
    try {
      await database.delete(id);
      return;
    } catch (err) {
      return err;
    }
  });

  // Create backup of database file
  ipcMain.handle(BACKUP_CRED_DATABASE_CHNL, async (event, path) => {
    try {
      const status = await database.backupDB(path);
      return status
    } catch (err) {
      return err;
    }
  })

  // Restore backup from backup file
  ipcMain.handle(RESTORE_CRED_DATABASE_CHNL, async (event, path) => {
    try {
      const status = await database.restoreDB(path);
      database.reload();
      return status
    } catch (err) {
      return err;
    }
  })

}
