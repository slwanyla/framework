import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ContohPage } from './contoh.page';

const routes: Routes = [
  {
    path: '',
    component: ContohPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ContohPageRoutingModule {}
