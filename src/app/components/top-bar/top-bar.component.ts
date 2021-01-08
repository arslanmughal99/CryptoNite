import { Router } from '@angular/router';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.scss']
})
export class TopBarComponent implements OnInit {
  @Input() actionType: 'settings' | 'back';
  constructor(
    private _router: Router
    ) { }

  ngOnInit() {
  }

  onNavigateSettings() {
    if(this.actionType === 'settings') {
      this._router.navigateByUrl('settings', {replaceUrl: true});
    } else {
      this._router.navigateByUrl('main', {replaceUrl: true});
    }
  }

}
