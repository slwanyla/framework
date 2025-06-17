import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { DapatdriverPageRoutingModule } from './dapatdriver-routing.module';  // Routing spesifik SplashPage
import { DapatdriverPage } from './dapatdriver.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DapatdriverPageRoutingModule,
    DapatdriverPage
  ]
})
export class DapatdriverPageModule {}