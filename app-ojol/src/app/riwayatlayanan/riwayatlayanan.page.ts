import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-riwayatlayanan',
  standalone: true,
  imports: [IonicModule, CommonModule],
  templateUrl: './riwayatlayanan.page.html',
  styleUrls: ['./riwayatlayanan.page.scss'],
})
export class RiwayatlayananPage implements OnInit {
  layanan: any[] = [];

  constructor(private router: Router) {}

  ngOnInit() {
    this.layanan = [
      {
        nama: 'Rifha Reinda Warich',
        waktu: '09.00',
        dari: 'Perum Karaba Indah Blok R.48',
        ke: 'Universitas Buana Perjuangan',
        harga: 24000,
      },
    ];
  }
}
