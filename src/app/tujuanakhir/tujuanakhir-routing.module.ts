import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TujuanakhirPage } from './tujuanakhir.page';

const routes: Routes = [
  {
    path: '',
    component: TujuanakhirPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TujuanakhirPageRoutingModule {}
