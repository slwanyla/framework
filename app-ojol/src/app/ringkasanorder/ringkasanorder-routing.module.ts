import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RingkasanorderPage } from './ringkasanorder.page';

const routes: Routes = [
  {
    path: '',
    component: RingkasanorderPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RingkasanorderPageRoutingModule {}
