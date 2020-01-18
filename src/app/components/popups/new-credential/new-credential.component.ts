import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import Picker from '@simonwep/pickr';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Credential } from '../../../../../interfaces/Credential';
import { ipcRenderer } from 'electron';
import { INSERT_DATABASE_CHNL } from '../../../../../core/constants/constants';
import { MatBottomSheetRef, MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-new-credential',
  templateUrl: './new-credential.component.html',
  styleUrls: ['./new-credential.component.scss']
})
export class NewCredentialComponent implements OnInit {
  newCredForm: FormGroup
  hide = true;
  picker: Picker;
  @ViewChild('colorPicker', { static: false })
  public colorPicker: ElementRef;

  constructor(
    private _fb: FormBuilder,
    private _bottomSheetRef: MatBottomSheetRef<NewCredentialComponent>,
    private _matSnakeBar: MatSnackBar
    ) { }

  ngOnInit() {
    this.newCredForm = this._fb.group({
      name: ['', [Validators.required]],
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    })
  }

  ngAfterViewInit(): void {
    this.picker = Picker.create({
      el: this.colorPicker.nativeElement,
      theme: 'nano',
      comparison: false,
      swatches: [
        'rgba(244, 67, 54, 1)',
        'rgba(233, 30, 99, 1)',
        'rgba(156, 39, 176, 1)',
        'rgba(103, 58, 183, 1)',
        'rgba(63, 81, 181, 1)',
        'rgba(3, 169, 244, 1)',
        'rgba(0, 188, 212, 1)'
      ],
      default: "rgba(156, 39, 176, 1)",
      components: {
        // Main components
        preview: true,
        opacity: true,
        hue: true,
        // Input / output Options
        interaction: {
          rgba: false,
          hex: true,
          input: true,
          cancel: true
        }
      }
    });
  }

  async saveCredential() {
    const color: string = this.picker.getColor().toHEXA().toString();
    const { name, username, password } = this.newCredForm.value as Credential;
    const newCredential: Credential = {
      name,
      username,
      password,
      color
    };
    try {
      const err = await ipcRenderer.invoke(INSERT_DATABASE_CHNL, newCredential);
      if(err) {
        this._matSnakeBar.open('Something went wrong ', 'Dismiss', {duration: 2000});
      } else {
        this._bottomSheetRef.dismiss();
      }
    } catch (err) {

    }
  }

}
