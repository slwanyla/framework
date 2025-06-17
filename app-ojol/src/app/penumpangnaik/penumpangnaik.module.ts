import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { PenumpangnaikPageRoutingModule } from './penumpangnaik-routing.module';  // Routing spesifik SplashPage
import { PenumpangnaikPage } from './penumpangnaik.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PenumpangnaikPageRoutingModule,
    PenumpangnaikPage
  ]
})
export class PenumpangnaikPageModule {}