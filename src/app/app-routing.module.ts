import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FreshStartComponent } from './components/fresh-start/fresh-start.component';
import { SettingsComponent } from './components/settings/settings.component';
import { MainInterfaceComponent } from './components/main-interface/main-interface.component';

const routes: Routes = [
  {
    path: '',
    component: FreshStartComponent,
    pathMatch: 'full'
  },
  {
    path: 'main',
    component: MainInterfaceComponent,
    pathMatch: 'full'
  },
  {
    path: 'settings',
    component: SettingsComponent,
    pathMatch: 'full'
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
