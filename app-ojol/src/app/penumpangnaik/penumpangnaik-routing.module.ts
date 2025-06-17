import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PenumpangnaikPage } from './penumpangnaik.page';

const routes: Routes = [
  {
    path: '',
    component: PenumpangnaikPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PenumpangnaikPageRoutingModule {}
