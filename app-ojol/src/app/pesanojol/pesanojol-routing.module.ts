import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PesanojolPage } from './pesanojol.page';

const routes: Routes = [
  {
    path: '',
    component: PesanojolPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PesanojolPageRoutingModule {}
