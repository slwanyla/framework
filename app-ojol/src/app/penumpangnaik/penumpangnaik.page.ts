import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { RouteService } from '../services/route.service';
import { Geolocation } from '@capacitor/geolocation';
import { FirebaseLocationService } from '../services/firebase-location.service';
import { OrderService } from '../services/order.service';
import * as L from 'leaflet';

@Component({
  selector: 'app-penumpangnaik',
  standalone: true,
  imports: [IonicModule, CommonModule],
  templateUrl: './penumpangnaik.page.html',
  styleUrls: ['./penumpangnaik.page.scss'],
})
export class PenumpangnaikPage implements OnInit {
  map: any;
  driverMarker: any;
  routeLayer?: L.GeoJSON;

  pickupLat = 0;
  pickupLng = 0;
  customerNama = '';
  alamatJemput = '';
  alamatTujuan = '';
  totalHarga = 0;
  destinationLat = 0;
  destinationLng = 0;
  destinationAddress = '';
  distanceToDestination: string = '';
  orderId: number = 0;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private firebaseLocation: FirebaseLocationService,
    private routeService: RouteService,
    private orderService: OrderService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.customerNama = params['nama'] || 'Customer';
      this.alamatJemput = params['pickupAddress'] || '-';
      this.alamatTujuan = params['destinationAddress'] || '-';
      this.totalHarga = +params['totalHarga'] || 0;
      this.pickupLat = +params['pickupLat'] || 0;
      this.pickupLng = +params['pickupLng'] || 0;
      this.destinationLat = +params['destinationLat'] || 0;
      this.destinationLng = +params['destinationLng'] || 0;
      this.destinationAddress = params['destinationAddress'] || '-';
      this.orderId = +params['orderId'] || 0;
    });
  }

  ionViewDidEnter() {
  this.setLeafletIcons();

  setTimeout(() => {
    this.loadMap();
    this.startRealtimeLocationUpdate();
  }, 500); // delay 0.5 detik agar DOM stabil
}

  loadMap() {
    this.map = L.map('map-penumpang-naik').setView([this.pickupLat, this.pickupLng], 15);
      setTimeout(() => {
    this.map.invalidateSize();
  }, 200);

    this.map.invalidateSize();

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    // Titik jemput
    L.marker([this.pickupLat, this.pickupLng]).addTo(this.map)
      .bindPopup(`Titik Jemput: ${this.alamatJemput}`);

    // Titik tujuan
    // Titik tujuan
    L.marker([this.destinationLat, this.destinationLng]).addTo(this.map)
      .bindPopup(`Tujuan: ${this.destinationAddress}`);

  }

  startRealtimeLocationUpdate() {
  Geolocation.watchPosition({
    enableHighAccuracy: true,
    timeout: 30000,
    maximumAge: 0
  }, (position, err) => {
    if (err || !position) {
      console.error('❌ Gagal ambil lokasi:', err);
      return;
    }

    const lat = position.coords.latitude;
    const lng = position.coords.longitude;

    this.updateDriverMarker(lat, lng);
    this.updateDistanceToDestination(lat, lng);
    this.firebaseLocation.updateDriverLocation(this.orderId, lat, lng);
  });
}


  updateDriverMarker(lat: number, lng: number) {
  // Update posisi marker driver
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
    if (!this.destinationLat || !this.destinationLng) {
    console.warn('❌ Tujuan belum tersedia');
    return;
  }

  // 💡 Gambar ulang rute ke tujuan
  this.routeService.getRoute(lng, lat, this.destinationLng, this.destinationLat).subscribe({
    
    next: (res) => {
      const geojsonRoute = res.features?.[0];
      if (!geojsonRoute) return;

      // Hapus rute lama jika ada
      if (this.routeLayer) this.map.removeLayer(this.routeLayer);

      // Tambahkan rute baru ke tujuan
      this.routeLayer = L.geoJSON(geojsonRoute, {
        style: { color: '#007bff', weight: 4 }
      }).addTo(this.map);

      // 💡 Update tampilan map supaya semua elemen terlihat
      const bounds = L.latLngBounds([
        [lat, lng],
        [this.destinationLat, this.destinationLng]
      ]);
      this.map.fitBounds(bounds, { padding: [50, 50] });

    },
    error: (err) => console.error('❌ Gagal ambil rute:', err)
  });
}


  updateDistanceToDestination(driverLat: number, driverLng: number) {
    const jarak = this.hitungJarak(driverLat, driverLng, this.destinationLat, this.destinationLng);
    this.distanceToDestination = jarak.toFixed(2);
  }

  hitungJarak(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371;
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a = Math.sin(dLat / 2) ** 2 +
              Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
              Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }

  private setLeafletIcons() {
    delete (L.Icon.Default.prototype as any)._getIconUrl;

    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
      iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    });
  }

  kirimStatus(status: string) {
  this.orderService.updatePerjalanan(this.orderId, status)
    .subscribe({
      next: () => console.log('✅ Status updated:', status),
      error: err => console.error('❌ Gagal update status:', err)
    });
}

updateStatus(status: string) {
  this.firebaseLocation.updateStatus(this.orderId, status);
}


  customerNaik() {
    this.kirimStatus('selesai'); 
    this.updateStatus('selesai');
    this.router.navigate(['/tujuanakhir'], {
      queryParams: {
        pickupAddress: this.alamatJemput,
        destinationAddress: this.alamatTujuan,
        destinationLat: this.destinationLat,
        destinationLng: this.destinationLng,
        totalHarga: this.totalHarga,
        nama: this.customerNama,
        pickupLat: this.pickupLat, // ✅ WAJIB DITAMBAH
        pickupLng: this.pickupLng,

      }
    });
  }

  bukaChat() {
    this.router.navigate(['/chat'], { queryParams: { from: 'penumpangnaik' } });
  }
}
