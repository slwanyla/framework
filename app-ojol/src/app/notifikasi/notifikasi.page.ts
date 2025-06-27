import { Component, OnInit } from '@angular/core';
import { NavController, IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-notifikasi',
  standalone: true,
  imports: [IonicModule, CommonModule],
  templateUrl: './notifikasi.page.html',
  styleUrls: ['./notifikasi.page.scss'],
})
export class NotifikasiPage implements OnInit {

  constructor(private navCtrl: NavController) {}
  
  ngOnInit() {}

  goBack() {
    this.navCtrl.navigateBack('/profilku');
  }
}
