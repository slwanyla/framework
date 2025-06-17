import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { JemputpenumpangPage } from './jemputpenumpang.page';

const routes: Routes = [
  {
    path: '',
    component: JemputpenumpangPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class JemputpenumpangPageRoutingModule {}
