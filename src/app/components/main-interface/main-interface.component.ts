import { ipcRenderer } from 'electron';
import { BehaviorSubject, Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Credential } from '../../../../interfaces/Credential';
import { MatBottomSheet } from '@angular/material/bottom-sheet';

import { NewCredentialComponent } from '../popups/new-credential/new-credential.component';
import { GETALL_DATABASE_CHNL, DELETE_CRED_DATABASE_CHNL } from '../../../../core/constants/constants';

@Component({
  selector: 'app-main-interface',
  templateUrl: './main-interface.component.html',
  styleUrls: ['./main-interface.component.scss']
})
export class MainInterfaceComponent implements OnInit {
  credentialStremer: BehaviorSubject<Credential[]> = new BehaviorSubject([]);
  credentialReciver: Observable<Credential[]> = this.credentialStremer.asObservable();
  allCredntials: Credential[] = [];
  filteredCredntials: Credential[] = [];
  query: string = '';

  constructor(
    private _matBotomSheet: MatBottomSheet,
    private _matSnakeBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.credentialReciver.subscribe(data => {
      this.allCredntials = data
      this.filterSearch(this.query);
    });
    // this.filteredCredntials = this.allCredntials;
    this.getAllCredntials();
  }

  /**
   * @description get all credntials from database and update list
  **/
  async getAllCredntials() {
    try {
      const allCred = await ipcRenderer.invoke(GETALL_DATABASE_CHNL);
      if (allCred === 'ERR') {
        this._matSnakeBar.open('Something went wrong', 'Dismiss', { duration: 2000 });
      } else {
        this.credentialStremer.next(allCred);
      }
    } catch (err) {
      this._matSnakeBar.open('Something went wrong', 'Dismiss', { duration: 2000 });
    }
  }

  /**
   * @description Open Bottom sheet to add new credential
  **/
  onAddNew() {
    const bottomRef = this._matBotomSheet.open(NewCredentialComponent);
    bottomRef.afterDismissed().subscribe(_ => {
      this.getAllCredntials();
    })
  }

  /**
   * @param query string to match against
   * @description filter the search results
  **/
  filterSearch(query: string) {
    if (query.trimLeft().trimRight().length > 0) {
      this.filteredCredntials = this.allCredntials.filter(cred => {
        if (cred.name.toLowerCase().match(query.toLowerCase())) {
          return cred;
        }
      });
    } else {
      this.filteredCredntials = [...this.allCredntials];
    }
  }


  private async delteFromDB(id: string) {
    try {
      const err = await ipcRenderer.invoke(DELETE_CRED_DATABASE_CHNL, id);
      if (err) {
        this._matSnakeBar.open('Cannot Delete', 'Dismiss', { duration: 2000 });
      }
    } catch (err) {
      this._matSnakeBar.open('Cannot Delete', 'Dismiss', { duration: 2000 });
      this.filteredCredntials = this.allCredntials;
    }
  }

  onDelete(id: string) {
    // Just give option to restore delted item within 3 sec
    const deleteRef = this._matSnakeBar.open('Deleted', 'Undo', { duration: 3000 });
    deleteRef.onAction().subscribe(_ => {
      this.filteredCredntials = this.allCredntials;
    });

    // perment removal from database based on action type
    deleteRef.afterDismissed().subscribe(des => {
      if (!des.dismissedByAction) {
        this.delteFromDB(id);
      }
    });

    // Temp removal from UI
    this.filteredCredntials = this.filteredCredntials.filter(val => {
      if (val._id !== id) {
        return val;
      }
    });
  }

}
