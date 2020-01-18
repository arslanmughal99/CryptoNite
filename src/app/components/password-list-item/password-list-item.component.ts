import { Component, OnInit, Input } from '@angular/core';
import { Credential } from '../../../../interfaces/Credential';
import { clipboard } from 'electron';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-password-list-item',
  templateUrl: './password-list-item.component.html',
  styleUrls: ['./password-list-item.component.scss']
})
export class PasswordListItemComponent implements OnInit {
  @Input('credData') credData: Credential;
  id: string;
  name: string;
  color: string;
  username: string;
  password: string;
  firstLetter: string;
  userCopied: Boolean = false;
  passCopy: Boolean = false;

  constructor(
    private _snakeBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.id = this.credData._id;
    this.name = this.credData.name;
    this.firstLetter = this.name.toString()[0].toUpperCase();
    this.color = this.credData.color;
    this.username = this.credData.username;
    this.password = this.credData.password;
  }

  /**
   * @description Copy Password to clipboard
  **/
  onCopyPass() {
    clipboard.writeText(this.password, 'clipboard');
    this.passCopy = true;
    setTimeout(_ => this.passCopy = false, 1000);
  }

  /**
   * @description Copy username to clipboard
  **/
  onCopyUser() {
    clipboard.writeText(this.username, 'clipboard');
    this.userCopied = true;
    setTimeout(_ => this.userCopied = false, 1000);
  }

}
