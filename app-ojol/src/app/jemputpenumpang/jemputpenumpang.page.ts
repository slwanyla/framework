import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import * as L from 'leaflet';

@Component({
  selector: 'app-jemputpenumpang',
  standalone: true,
  imports: [IonicModule, CommonModule],
  templateUrl: './jemputpenumpang.page.html',
  styleUrls: ['./jemputpenumpang.page.scss'],
})
export class JemputpenumpangPage implements OnInit {

  map: any;

  constructor(private router: Router) {}

  ngOnInit() {
    this.loadMap();
  }

  loadMap() {
    this.map = L.map('map-jemput-penumpang').setView([-6.3053842, 107.3124103], 14); // Karawang

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    L.marker([-6.3053842, 107.3124103]).addTo(this.map)
      .bindPopup('Karawang')
      .openPopup();
  }

    menujuCustomer() {
    this.router.navigateByUrl('/penumpangnaik');
  }

  bukaChat() {
 this.router.navigate(['/chat'], { queryParams: { from: 'jemputpenumpang' } });
}

}
