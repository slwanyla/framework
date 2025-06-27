import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MenudriverPage } from './menudriver.page';

const routes: Routes = [
  {
    path: '',
    component: MenudriverPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MenudriverPageRoutingModule {}
