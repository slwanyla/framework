import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { PusatbantuanPageRoutingModule } from './pusatbantuan-routing.module';  // Routing spesifik SplashPage
import { PusatbantuanPage } from './pusatbantuan.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PusatbantuanPageRoutingModule,
    PusatbantuanPage
  ]
})
export class PusatbantuanPageModule {}