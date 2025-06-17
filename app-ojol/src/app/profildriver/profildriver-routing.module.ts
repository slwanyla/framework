import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProfildriverPage } from './profildriver.page';

const routes: Routes = [
  {
    path: '',
    component: ProfildriverPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProfildriverPageRoutingModule {}
