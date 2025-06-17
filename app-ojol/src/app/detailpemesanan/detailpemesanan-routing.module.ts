import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DetailpemesananPage } from './detailpemesanan.page';

const routes: Routes = [
  {
    path: '',
    component: DetailpemesananPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DetailpemesananPageRoutingModule {}
