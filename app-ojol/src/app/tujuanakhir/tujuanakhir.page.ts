import { Component, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import * as L from 'leaflet';

@Component({
  selector: 'app-tujuanakhir',
  standalone: true,
  imports: [IonicModule, CommonModule],
  templateUrl: './tujuanakhir.page.html',
  styleUrls: ['./tujuanakhir.page.scss'],
})
export class TujuanakhirPage implements AfterViewInit {

  map: any;

  constructor(private router: Router) {}

  ngAfterViewInit() {
    this.loadMap();
  }

  loadMap() {
    this.map = L.map('map-tujuan-akhir').setView([-6.3053842, 107.3124103], 14); // Karawang

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    L.marker([-6.3053842, 107.3124103]).addTo(this.map)
      .bindPopup('Tujuan Akhir - Karawang')
      .openPopup();
  }

  selesaikanTujuan() {
    this.router.navigateByUrl('/ringkasanorder');
  }

  bukaChat() {
    this.router.navigate(['/chat'], { queryParams: { from: 'tujuanakhir' } });
  }

}
