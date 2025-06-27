import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PengaturandriverPage } from './pengaturandriver.page';

const routes: Routes = [
  {
    path: '',
    component: PengaturandriverPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PengaturandriverPageRoutingModule {}
