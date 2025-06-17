import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { PendapatanPageRoutingModule } from './pendapatan-routing.module';  // Routing spesifik SplashPage
import { PendapatanPage } from './pendapatan.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PendapatanPageRoutingModule,
    PendapatanPage
  ]
})
export class PendapatanPageModule {}