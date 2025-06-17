import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RingkasanorderPageRoutingModule } from './ringkasanorder-routing.module';  // Routing spesifik SplashPage
import { RingkasanorderPage } from './ringkasanorder.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RingkasanorderPageRoutingModule,
    RingkasanorderPage
  ]
})
export class RingkasanorderPageModule {}