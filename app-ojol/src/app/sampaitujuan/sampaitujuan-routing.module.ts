import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SampaitujuanPage } from './sampaitujuan.page';

const routes: Routes = [
  {
    path: '',
    component: SampaitujuanPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SampaitujuanPageRoutingModule {}
