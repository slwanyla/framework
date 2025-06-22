import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SampaitujuanPageRoutingModule } from './sampaitujuan-routing.module'; 
import { SampaitujuanPage } from './sampaitujuan.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SampaitujuanPageRoutingModule,
    SampaitujuanPage
  ]
})
export class SampaitujuanPageModule {}