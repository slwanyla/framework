import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { NotifikasiPageRoutingModule } from './notifikasi-routing.module';  // Routing spesifik SplashPage
import { NotifikasiPage } from './notifikasi.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NotifikasiPageRoutingModule,
    NotifikasiPage
  ]
})
export class NotifikasiPageModule {}