import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AktivitasdriverPage } from './aktivitasdriver.page';

const routes: Routes = [
  {
    path: '',
    component: AktivitasdriverPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AktivitasdriverPageRoutingModule {}
