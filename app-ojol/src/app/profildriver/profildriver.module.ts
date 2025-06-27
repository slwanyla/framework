import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ProfildriverPageRoutingModule } from './profildriver-routing.module';  // Routing spesifik SplashPage
import { ProfildriverPage } from './profildriver.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProfildriverPageRoutingModule,
    ProfildriverPage
  ]
})
export class ProfildriverPageModule {}