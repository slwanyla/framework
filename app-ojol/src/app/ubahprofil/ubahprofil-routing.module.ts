import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UbahprofilPage } from './ubahprofil.page';

const routes: Routes = [
  {
    path: '',
    component: UbahprofilPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UbahprofilPageRoutingModule {}
