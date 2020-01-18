import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from '../../services/localstorage/local-storage.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ipcRenderer, remote } from 'electron';
import { UPDATE_PASS_CHNL, BACKUP_CRED_DATABASE_CHNL, RESTORE_CRED_DATABASE_CHNL } from '../../../../core/constants/constants';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  hide: Boolean = true;
  valid: Boolean = false;
  darkTheme: Boolean = true;
  passRstForm: FormGroup

  constructor(
    private _localStorage: LocalStorageService,
    private _fb: FormBuilder,
    private _snakeBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.passRstForm = this._fb.group({
      password: ['', [Validators.required, Validators.minLength(10)]],
      retype: ['', [Validators.required, Validators.minLength(10)]]
    });
    this.passRstForm.valueChanges.subscribe(_ => {
      this.valid = this.validatePassword();
    })
    this.setThemeStatus();
    document.querySelector('#root-body').className = this._localStorage.getTheme ? this._localStorage.getTheme : 'dark-theme';
  }

  /**
   * @param e Event Object
   * @description Toggle theme b/w dark and light
   * @returns void
  **/
  toggleTheme(e): void {
    if (e.checked) {
      document.querySelector('#root-body').className = 'dark-theme';
      this._localStorage.setTheme('dark-theme');
    } else {
      document.querySelector('#root-body').className = 'light-theme';
      this._localStorage.setTheme('light-theme');
    }
  }

  /**
   * @description set new theme to localstorage
   * @returns void
  **/
  private setThemeStatus(): void {
    const theme = this._localStorage.getTheme;
    if (theme === 'light-theme') {
      this.darkTheme = false;
    } else {
      this.darkTheme = true;
    }
  }

  /**
 * @description Do password validation
 * @returns Boolean
**/
  private validatePassword(): Boolean {
    const { password, retype } = this.passRstForm.value;
    let formValid: Boolean = this.passRstForm.valid;
    let retypeCheck = password === retype;
    return formValid && retypeCheck;
  }

  /**
   * @description Reset password
   * @returns Void
  **/
  async handlePasswordReset(): Promise<void> {
    const { password } = this.passRstForm.value;
    try {
      const err = await ipcRenderer.invoke(UPDATE_PASS_CHNL, password);
      if (err) {
        this._snakeBar.open('Failed :(', 'Dismiss', { duration: 2000 });
      } else {
        this._snakeBar.open('Reset Sucessfully', 'Dismiss', { duration: 2000 });
        setTimeout(_ => {
          remote.app.relaunch();
          remote.app.exit();
        }, 2000)
      }
    } catch (err) {
      this._snakeBar.open('Failed :(', 'Dismiss', { duration: 2000 });
    }
  }

  async backUp(): Promise<void> {
    const backUpLocation = remote.dialog.showOpenDialogSync({ title: 'Select folder to backup', properties: ['openDirectory'], buttonLabel: 'Save Backup' });
    if (backUpLocation) {
      const status = await ipcRenderer.invoke(BACKUP_CRED_DATABASE_CHNL, backUpLocation[0]);
      if (!status) {
        this._snakeBar.open('Backup created, Store in safe', 'Dismiss', { duration: 3000 });
      } else {
        this._snakeBar.open('Something went wrong', 'Dismiss', { duration: 2000 });
      }
    }
  }

  async restore(): Promise<void> {
    const backUpLocation = remote.dialog.showOpenDialogSync({ title: 'Select folder to backup', properties: ['openFile'], filters: [{ name: 'backup file', extensions: ['bak'] }], buttonLabel: 'Save Backup' });
    if (backUpLocation) {
      const status = await ipcRenderer.invoke(RESTORE_CRED_DATABASE_CHNL, backUpLocation[0]);
      if (!status) {
        this._snakeBar.open('Restored sucessfull, Relauncing app', 'Dismiss', { duration: 3000 });
        setTimeout(_ => {
          remote.app.relaunch();
          remote.app.exit();
        }, 2000);
      } else {
        this._snakeBar.open('Something went wrong', 'Dismiss', { duration: 2000 });
      }
    }
  }

  openSite() {
    remote.shell.openExternal('https://www.gravitonapps.com');
  }

}
