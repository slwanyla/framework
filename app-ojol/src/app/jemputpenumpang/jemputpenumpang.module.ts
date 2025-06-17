import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { JemputpenumpangPageRoutingModule } from './jemputpenumpang-routing.module';  // Routing spesifik SplashPage
import { JemputpenumpangPage } from './jemputpenumpang.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    JemputpenumpangPageRoutingModule,
    JemputpenumpangPage
  ]
})
export class JemputpenumpangPageModule {}