import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SplashscreenPageRoutingModule } from './splashscreen-routing.module';  // Routing spesifik SplashPage
import { SplashscreenPage } from './splashscreen.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SplashscreenPageRoutingModule,
    SplashscreenPage
  ]
})
export class SplashscreenPageModule {}