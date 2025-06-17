import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { PesanojolPageRoutingModule } from './pesanojol-routing.module';  // Routing spesifik SplashPage
import { PesanojolPage } from './pesanojol.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PesanojolPageRoutingModule,
    PesanojolPage
  ]
})
export class PesanojolPageModule {}