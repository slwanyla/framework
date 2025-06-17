import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { MenunggudriverPageRoutingModule } from './menunggudriver-routing.module';  // Routing spesifik SplashPage
import { MenunggudriverPage } from './menunggudriver.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MenunggudriverPageRoutingModule,
    MenunggudriverPage
  ]
})
export class MenunggudriverPageModule {}