import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ProfilkuPageRoutingModule } from './profilku-routing.module';  // Routing spesifik SplashPage
import { ProfilkuPage } from './profilku.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProfilkuPageRoutingModule,
    ProfilkuPage
  ]
})
export class ProfilkuPageModule {}