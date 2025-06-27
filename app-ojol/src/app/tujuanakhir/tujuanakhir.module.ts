import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TujuanakhirPageRoutingModule } from './tujuanakhir-routing.module';  // Routing spesifik SplashPage
import { TujuanakhirPage } from './tujuanakhir.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TujuanakhirPageRoutingModule,
    TujuanakhirPage
  ]
})
export class TujuanakhirPageModule {}