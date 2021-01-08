import { Component } from '@angular/core';
import { ElectronService } from './core/services';
import { TranslateService } from '@ngx-translate/core';
import { AppConfig } from '../environments/environment';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material/icon';
import { LocalStorageService } from './services/localstorage/local-storage.service';
import { remote } from 'electron';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(
    public electronService: ElectronService,
    private translate: TranslateService,
    iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer,
    private _localStorage: LocalStorageService
  ) {
    this.setLastTheme();
    translate.setDefaultLang('en');

    // Custom Icons Registery
    iconRegistry.addSvgIcon('copy', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/copy.svg'));
    iconRegistry.addSvgIcon('add', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/plus.svg'));
    iconRegistry.addSvgIcon('settings', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/settings.svg'));
    iconRegistry.addSvgIcon('shield', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/shield.svg'));
    iconRegistry.addSvgIcon('user', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/user.svg'));
    iconRegistry.addSvgIcon('keys', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/keys.svg'));
    iconRegistry.addSvgIcon('hide', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/hide.svg'));
    iconRegistry.addSvgIcon('show', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/visibility.svg'));
    iconRegistry.addSvgIcon('name', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/name.svg'));

  }

  setLastTheme() {
    const themeClass = this._localStorage.getTheme;
    document.querySelector('#root-body').className = themeClass;
  }

}
