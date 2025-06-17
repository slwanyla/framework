import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { VerifycodePageRoutingModule } from './verifycode-routing.module';  // Routing spesifik SplashPage
import { VerifycodePage } from './verifycode.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VerifycodePageRoutingModule,
    VerifycodePage
  ]
})
export class VerifycodePageModule {}