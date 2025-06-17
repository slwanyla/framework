import { Component, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import * as L from 'leaflet';

@Component({
  selector: 'app-penumpangnaik',
  standalone: true,
  imports: [IonicModule, CommonModule],
  templateUrl: './penumpangnaik.page.html',
  styleUrls: ['./penumpangnaik.page.scss'],
})
export class PenumpangnaikPage implements AfterViewInit {

  map: any;

  constructor(private router: Router) {}

  ngAfterViewInit() {
    this.loadMap();
  }

  loadMap() {
    this.map = L.map('map-penumpang-naik').setView([-6.3053842, 107.3124103], 14); // Karawang

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    L.marker([-6.3053842, 107.3124103]).addTo(this.map)
      .bindPopup('Penumpang Naik - Karawang')
      .openPopup();
  }
  
  customerNaik() {
    this.router.navigateByUrl('/tujuanakhir');
  }
  
  bukaChat() {
      this.router.navigate(['/chat'], { queryParams: { from: 'penumpangnaik' } });
  }

}
