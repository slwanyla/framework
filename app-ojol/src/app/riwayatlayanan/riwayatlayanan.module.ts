import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RiwayatlayananPageRoutingModule } from './riwayatlayanan-routing.module';  // Routing spesifik SplashPage
import { RiwayatlayananPage } from './riwayatlayanan.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RiwayatlayananPageRoutingModule,
    RiwayatlayananPage
  ]
})
export class RiwayatlayananPageModule {}