import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { UbahprofilPageRoutingModule } from './ubahprofil-routing.module';  // Routing spesifik SplashPage
import { UbahprofilPage } from './ubahprofil.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UbahprofilPageRoutingModule,
    UbahprofilPage
  ]
})
export class UbahprofilPageModule {}