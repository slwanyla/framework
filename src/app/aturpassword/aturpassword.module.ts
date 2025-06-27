import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AturPasswordPageRoutingModule } from './aturpassword-routing.module';// Routing spesifik SplashPage
import { AturPasswordPage } from './aturpassword.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AturPasswordPageRoutingModule,
    AturPasswordPage
  ]
})
export class AturPasswordPageModule {}