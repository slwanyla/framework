import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PendapatanPage } from './pendapatan.page';

const routes: Routes = [
  {
    path: '',
    component: PendapatanPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PendapatanPageRoutingModule {}
