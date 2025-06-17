import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PusatbantuanPage } from './pusatbantuan.page';

const routes: Routes = [
  {
    path: '',
    component: PusatbantuanPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PusatbantuanPageRoutingModule {}
