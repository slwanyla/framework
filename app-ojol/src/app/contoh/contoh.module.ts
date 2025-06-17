import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ContohPageRoutingModule } from './contoh-routing.module';

import { ContohPage } from './contoh.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ContohPageRoutingModule
  ],
  declarations: [ContohPage]
})
export class ContohPageModule {}
