import { Component, AfterViewInit, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { Geolocation } from '@capacitor/geolocation';
import { RouteService } from '../services/route.service';
import { OrderService } from '../services/order.service';
import * as L from 'leaflet';

@Component({
  selector: 'app-tujuanakhir',
  standalone: true,
  imports: [IonicModule, CommonModule],
  templateUrl: './tujuanakhir.page.html',
  styleUrls: ['./tujuanakhir.page.scss'],
})
export class TujuanakhirPage implements OnInit, AfterViewInit {
  map: any;
  routeLayer?: L.GeoJSON;
  driverMarker: any;

  // dari query params
  pickupLat = 0;
  pickupLng = 0;
  destinationLat = 0;
  destinationLng = 0;
  customerNama = '';
  destinationAddress = '';
  jarakKeTujuan = '';
  waktuSelesai = '';
  

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private routeService: RouteService,
    private order : OrderService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.pickupLat = +params['pickupLat'] || 0;
      this.pickupLng = +params['pickupLng'] || 0;
      this.destinationLat = +params['destinationLat'] || 0;
      this.destinationLng = +params['destinationLng'] || 0;
      this.customerNama = params['nama'] || '-';
      this.destinationAddress = params['destinationAddress'] || '-';

      console.log('Pickup:', this.pickupLat, this.pickupLng);
      console.log('Destination:', this.destinationLat, this.destinationLng);

      
    });
  }

  ngAfterViewInit() {
    this.setLeafletIcons();
    requestAnimationFrame(() => {
      setTimeout(() => {
        this.loadMap();
        this.trackDriver();
      }, 200);
    });
}


  loadMap() {
    this.map = L.map('map-tujuan-akhir').setView([this.pickupLat, this.pickupLng], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    L.marker([this.pickupLat, this.pickupLng])
      .addTo(this.map)
      .bindPopup('Titik Jemput');

    L.marker([this.destinationLat, this.destinationLng])
      .addTo(this.map)
      .bindPopup('Tujuan');

    this.tampilkanRute();
  }

  private setLeafletIcons() {
  delete (L.Icon.Default.prototype as any)._getIconUrl;

  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png'
  });
}


 tampilkanRute() {
  if (
    this.pickupLat === 0 || this.pickupLng === 0 ||
    this.destinationLat === 0 || this.destinationLng === 0
  ) {
    console.warn('❌ Koordinat tidak lengkap, tidak bisa ambil rute');
    return;
  }

  this.routeService.getRoute(this.pickupLng, this.pickupLat, this.destinationLng, this.destinationLat)
    .subscribe({
      next: (res) => {
        const geojson = res.features?.[0];
        if (!geojson) return;

        // Hapus rute lama kalau ada
        if (this.routeLayer) this.map.removeLayer(this.routeLayer);

        // Tambahkan rute baru ke map
        this.routeLayer = L.geoJSON(geojson, {
          style: {
            color: 'blue',
            weight: 5
          }
        }).addTo(this.map);

        // ✅ Ambil jarak total dari response ORS
        const totalDistanceInMeters = geojson.properties?.summary?.distance || 0;
        const totalDistanceInKm = totalDistanceInMeters / 1000;
        this.jarakKeTujuan = totalDistanceInKm.toFixed(2);

        // ✅ Fit map ke rute
        const bounds = L.geoJSON(geojson).getBounds();
        this.map.fitBounds(bounds, { padding: [50, 50] });
      },
      error: (err) => console.error('Gagal ambil rute:', err)
    });
}



  trackDriver() {
  Geolocation.watchPosition({ enableHighAccuracy: true }, (pos, err) => {
    if (err || !pos) return;
    const lat = pos.coords.latitude;
    const lng = pos.coords.longitude;

    if (this.driverMarker) {
      this.driverMarker.setLatLng([lat, lng]);
    } else {
      this.driverMarker = L.marker([lat, lng], {
        icon: L.icon({
          iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
          iconSize: [30, 30],
          iconAnchor: [15, 30]
        })
      }).addTo(this.map).bindPopup('Posisi Anda');
    }

    // ❌ Jangan update this.jarakKeTujuan di sini
    // Karena kita sudah dapat jarak dari rute sebenarnya
  });
}


  hitungJarak(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371;
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a = Math.sin(dLat/2)**2 +
              Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
              Math.sin(dLon/2)**2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }

  selesaikanTujuan() {
  const now = new Date();
  const jamSelesai = now.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  }); // hasil contoh: "12:09"

  this.router.navigate(['/ringkasanorder'], {
    queryParams: {
      nama: this.customerNama,
      tujuan: this.destinationAddress,
      waktu: jamSelesai, // ⬅️ ini yang kamu maksud
      jarak: this.jarakKeTujuan,
      jarakTempuh: this.jarakKeTujuan, // ← dikirim dari perhitungan
      waktuTempuh: jamSelesai,   
    }
  });
}


  bukaChat() {
    this.router.navigate(['/chat'], { queryParams: { from: 'tujuanakhir' } });
  }
}
