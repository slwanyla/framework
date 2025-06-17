import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UbahprofildriverPage } from './ubahprofildriver.page';

const routes: Routes = [
  {
    path: '',
    component: UbahprofildriverPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UbahprofildriverPageRoutingModule {}
