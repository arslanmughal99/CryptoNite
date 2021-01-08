import { Router } from '@angular/router';
import { ipcRenderer, remote } from 'electron';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Component, OnInit, NgZone } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { masterCheck } from '../../../../interfaces/Credential';
import { INIT_DATABASE_CHNL } from '../../../../core/constants/constants';
import { LocalStorageService } from '../../services/localstorage/local-storage.service';

@Component({
  selector: 'app-fresh-start',
  templateUrl: './fresh-start.component.html',
  styleUrls: ['./fresh-start.component.scss']
})
export class FreshStartComponent implements OnInit {
  valid: Boolean;
  hide = true;
  firstRun: Boolean;
  masterPassForm: FormGroup
  constructor(
    private _router: Router,
    private _localStorage: LocalStorageService,
    private _fb: FormBuilder,
    private _matSnakBar: MatSnackBar,
    private _zone: NgZone
  ) { }

  ngOnInit() {
    this.valid = false;
    this.firstRun = this._localStorage.firstRun;
    this.masterPassForm = this._fb.group({
      password: ['', [Validators.required, Validators.minLength(10)]],
      retype: ''
    })
    this.masterPassForm.valueChanges.subscribe(_ => {
      this.valid = this.validatePassword();
    })

  }

  /**
   * @description Do password validation
   * @returns Boolean
  **/
  private validatePassword(): Boolean {
    const { password, retype } = this.masterPassForm.value as masterCheck;
    let formValid: Boolean = this.masterPassForm.valid;
    let retypeCheck: Boolean = true;
    if (!this.firstRun) {
      retypeCheck = password === retype;
    }
    return formValid && retypeCheck;
  }

  /**
   * @description handle async click event for password entry component
  **/
  async onContinue() {
    const { password } = this.masterPassForm.value as masterCheck;
    ipcRenderer.on('db-status', (e, status) => {
      if (status.name) {
        this._zone.run(_ => {
          this._matSnakBar.open('Wrong Password', 'Dismiss', { duration: 2000 });
        })
      } else {
        this._zone.run(_ => {
          this._router.navigateByUrl('main', { replaceUrl: true });
        })
      }
    });
    await ipcRenderer.invoke(INIT_DATABASE_CHNL, password)
  }

  openSite() {
    remote.shell.openExternal('https://www.gravitonapps.com');
  }

}
