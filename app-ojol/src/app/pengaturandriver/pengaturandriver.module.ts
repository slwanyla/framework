import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { PengaturandriverPageRoutingModule } from './pengaturandriver-routing.module';  // Routing spesifik SplashPage
import { PengaturandriverPage } from './pengaturandriver.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PengaturandriverPageRoutingModule,
    PengaturandriverPage
  ]
})
export class PengaturandriverPageModule {}