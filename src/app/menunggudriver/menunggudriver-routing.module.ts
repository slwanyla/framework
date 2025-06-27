import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MenunggudriverPage } from './menunggudriver.page';

const routes: Routes = [
  {
    path: '',
    component: MenunggudriverPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MenunggudriverPageRoutingModule {}
