import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RiwayatlayananPage } from './riwayatlayanan.page';

const routes: Routes = [
  {
    path: '',
    component: RiwayatlayananPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RiwayatlayananPageRoutingModule {}
