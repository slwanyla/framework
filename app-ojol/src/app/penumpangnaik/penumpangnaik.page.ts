import { Component, OnInit } from '@angular/core';
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

  isRuteLoaded: boolean = false;
  isLoadingRute = false;


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
      this.getInitialLocationAndDrawRoute(); // Ambil posisi awal
      this.startRealtimeLocationUpdate();    // Update posisi selanjutnya
    }, 500);
  }

  loadMap() {
    this.map = L.map('map-penumpang-naik').setView([this.pickupLat, this.pickupLng], 15);
    setTimeout(() => this.map.invalidateSize(), 300);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    L.marker([this.pickupLat, this.pickupLng]).addTo(this.map).bindPopup(`Titik Jemput: ${this.alamatJemput}`);
    L.marker([this.destinationLat, this.destinationLng]).addTo(this.map).bindPopup(`Tujuan: ${this.destinationAddress}`);
  }

  async getInitialLocationAndDrawRoute(retry = 0) {
  try {
    console.log(`⏳ Mencoba ambil lokasi (percobaan ke-${retry + 1})`);
    this.isLoadingRute = true;

    const pos = await Geolocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 30000,
      maximumAge: 0
    });

    const lat = pos.coords.latitude;
    const lng = pos.coords.longitude;

    console.log('✅ Lokasi awal berhasil diambil:', lat, lng);

    this.updateDriverMarker(lat, lng);
    this.updateDistanceToDestination(lat, lng);
    this.firebaseLocation.updateDriverLocation(this.orderId, lat, lng);

    this.routeService.getRoute(lng, lat, this.destinationLng, this.destinationLat).subscribe({
      next: (res) => {
        const geojsonRoute = res.features?.[0];
        if (!geojsonRoute) return;

        if (this.routeLayer) this.map.removeLayer(this.routeLayer);
        this.routeLayer = L.geoJSON(geojsonRoute, {
          style: { color: '#007bff', weight: 4 }
        }).addTo(this.map);

        const bounds = L.latLngBounds([
          [lat, lng],
          [this.destinationLat, this.destinationLng]
        ]);
        this.map.fitBounds(bounds, { padding: [50, 50] });

        this.isRuteLoaded = true;
        this.isLoadingRute = false;
        console.log('🗺️ Rute berhasil ditampilkan.');
      },
      error: (err) => {
        console.error('❌ Gagal ambil rute awal:', err);
        this.isLoadingRute = false;
      }
    });

  } catch (err) {
    console.error(`❌ Gagal ambil lokasi (percobaan ke-${retry + 1}):`, err);

    if (retry < 2) {
      setTimeout(() => this.getInitialLocationAndDrawRoute(retry + 1), 3000); // retry 2x, delay 3 detik
    } else {
      alert('❌ Gagal mendapatkan lokasi. Pastikan GPS aktif dan izin lokasi diberikan.');
    }
    this.isLoadingRute = false;
  }
}



  startRealtimeLocationUpdate() {
    Geolocation.watchPosition({
      enableHighAccuracy: true,
      timeout: 30000,
      maximumAge: 0
    }, (position, err) => {
      if (err || !position) {
        console.error('❌ Gagal ambil lokasi realtime:', err);
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
    console.log('➡️ Kirim update status ke backend:', this.orderId, 'selesai');
    this.kirimStatus('selesai');
    this.updateStatus('selesai');
    this.router.navigate(['/ringkasanorder'], {
      queryParams: {
        pickupAddress: this.alamatJemput,
        destinationAddress: this.alamatTujuan,
        destinationLat: this.destinationLat,
        destinationLng: this.destinationLng,
        totalHarga: this.totalHarga,
        nama: this.customerNama,
        pickupLat: this.pickupLat,
        pickupLng: this.pickupLng,
        orderId:this.orderId

        

      }
    });
  }

  bukaChat() {
    this.router.navigate(['/chat'], { queryParams: { from: 'penumpangnaik' } });
  }
}
