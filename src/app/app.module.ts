import 'reflect-metadata';
import '../polyfills';

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { CoreModule } from './core/core.module';

import { AppRoutingModule } from './app-routing.module';

// NG Translate
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { AppComponent } from './app.component';
import { FreshStartComponent } from './components/fresh-start/fresh-start.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatIconModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatSlideToggleModule, MatRippleModule, MatDialogModule, MatSnackBarModule, MatBottomSheetModule } from '@angular/material';
import { SettingsComponent } from './components/settings/settings.component';
import { TopBarComponent } from './components/top-bar/top-bar.component';
import { MainInterfaceComponent } from './components/main-interface/main-interface.component';
import { PasswordListItemComponent } from './components/password-list-item/password-list-item.component';
import { NewCredentialComponent } from './components/popups/new-credential/new-credential.component';

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [AppComponent, FreshStartComponent, SettingsComponent, TopBarComponent, MainInterfaceComponent, PasswordListItemComponent, NewCredentialComponent],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    CoreModule,
    AppRoutingModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    BrowserAnimationsModule,

    // AngularMaterial Components here
    MatIconModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSlideToggleModule,
    MatRippleModule,
    MatDialogModule,
    MatSnackBarModule,
    MatBottomSheetModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [NewCredentialComponent]
})
export class AppModule {}
