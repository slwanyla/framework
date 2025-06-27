import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AktivitasdriverPageRoutingModule } from './aktivitasdriver-routing.module';  // Routing spesifik SplashPage
import { AktivitasdriverPage } from './aktivitasdriver.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AktivitasdriverPageRoutingModule,
    AktivitasdriverPage
  ]
})
export class AktivitasdriverPageModule {}