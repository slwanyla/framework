import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DapatdriverPage } from './dapatdriver.page';

const routes: Routes = [
  {
    path: '',
    component: DapatdriverPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DapatdriverPageRoutingModule {}
