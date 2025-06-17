import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { HubungiadminPageRoutingModule } from './hubungiadmin-routing.module';  // Routing spesifik SplashPage
import {HubungiadminPage } from './hubungiadmin.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HubungiadminPageRoutingModule,
    HubungiadminPage
  ]
})
export class HubungiadminPageModule {}