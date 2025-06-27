import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { DetailpemesananPageRoutingModule } from './detailpemesanan-routing.module';  // Routing spesifik SplashPage
import { DetailpemesananPage } from './detailpemesanan.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DetailpemesananPageRoutingModule,
    DetailpemesananPage
  ]
})
export class DetailpemesananPageModule {}