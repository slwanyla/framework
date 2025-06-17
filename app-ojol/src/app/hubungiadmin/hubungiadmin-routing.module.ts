import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HubungiadminPage } from './hubungiadmin.page';

const routes: Routes = [
  {
    path: '',
    component: HubungiadminPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HubungiadminPageRoutingModule {}
