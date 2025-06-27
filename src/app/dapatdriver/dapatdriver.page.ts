import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { IonicModule, ToastController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import * as L from 'leaflet';
import { Subscription, interval } from 'rxjs';
import { FirebaselistenerService} from '../services/firebaselistener.service';
import { getDatabase, ref, onValue } from 'firebase/database';
import { OrderService } from 'src/app/services/order.service';
import { RouteService } from '../services/route.service';

@Component({
  selector: 'app-dapatdriver',
  standalone: true,
  imports: [IonicModule, CommonModule],
  templateUrl: './dapatdriver.page.html',
  styleUrls: ['./dapatdriver.page.scss'],
})
export class DapatdriverPage implements OnInit, AfterViewInit, OnDestroy {

  map!: L.Map;
  driver: any = null;
  metodePembayaran: string = '';
  jenisKendaraan: string = '';

  pickupAddress: string = '';
  destinationAddress: string = '';

  pickupLat: number = 0;
  pickupLng: number = 0;
  destinationLat: number = 0;
  destinationLng: number = 0;

  orderId: number = 0;
  ongkosKirim: number = 0;
  biayaAdmin: number = 0;
  pajak: number = 0;
  totalHarga: number = 0;
  

  jarakTempuh: string = '';
  waktuTempuh: string = '';
  userMarker?: L.Marker;
  driverMarker?: L.Marker;
  distanceToDriver: string = '';
  statusPerjalanan: string = '';
  mapInitialized = false;
  routeLayer?: L.GeoJSON;

 
  arrivalNotified: boolean = false;
  pollingSubscription?: Subscription;

  constructor(
    private router: Router,
    private http: HttpClient,
    private route: ActivatedRoute,
    private toastCtrl: ToastController,
    private firebaseListener : FirebaselistenerService,
    private orderServices : OrderService,
    private routeService : RouteService
    
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.metodePembayaran = params['metodePembayaran'] || '';
      this.pickupAddress = params['pickupAddress'] || 'Alamat jemput belum tersedia';
      this.destinationAddress = params['destinationAddress'] || 'Alamat tujuan belum tersedia';

      this.pickupLat = +params['pickupLat'] || 0;
      this.pickupLng = +params['pickupLng'] || 0;
      this.destinationLat = +params['destinationLat'] || 0;
      this.destinationLng = +params['destinationLng'] || 0;

      this.ongkosKirim = +params['ongkosKirim'] || 0;
      this.biayaAdmin = +params['biayaAdmin'] || 0;
      this.pajak = +params['pajak'] || 0;
      this.totalHarga = +params['totalHarga'] || 0;

      this.jenisKendaraan = params['kendaraan'] || '';

      this.orderId = +params['orderId'];
      this.loadDriver(this.orderId);

      


      if (this.pickupLat && this.pickupLng && this.destinationLat && this.destinationLng) {
        const distance = this.calculateDistance(this.pickupLat, this.pickupLng, this.destinationLat, this.destinationLng);
        this.jarakTempuh = distance.toFixed(2) + ' Km';
        const waktu = this.calculateEstimatedTime(distance);
        this.waktuTempuh = Math.round(waktu) + ' Menit';
      }
    });

    
    this.startPollingDriverArrival();
    this.listenToDriverRealtime();
  }

  ngAfterViewInit() {
  this.initMap();

  requestAnimationFrame(() => {
    setTimeout(() => {
      this.setLeafletIcons();
      this.showUserMarker(this.pickupLat, this.pickupLng);
      this.map.invalidateSize(); // ⬅️ ini penting
    }, 300);
  });
}



  ngOnDestroy() {
    if (this.pollingSubscription) {
      this.pollingSubscription.unsubscribe();
    }
  }

  loadDriver(orderId: number) {
  this.orderServices.getDriverByOrderId(orderId).subscribe({
    next: (res) => {
      this.driver = res;
      console.log('✅ Driver didapat:', this.driver);
      this.listenToDriverRealtime(); 
    },
    error: (err) => {
      console.error('❌ Gagal ambil driver:', err);
    }
  });
}


  

  initMap() {
    this.map = L.map('map').setView([-6.3107, 107.3176], 15);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);
    this.mapInitialized = true;
  }

    updateMap(driverLat: number, driverLng: number) {
  // Tambahkan marker driver
  if (!this.driverMarker) {
    this.driverMarker = L.marker([driverLat, driverLng], {
      icon: L.icon({
        iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
        iconSize: [30, 30]
      })
    }).addTo(this.map).bindPopup(`Driver: ${this.driver?.nama || 'Driver'}`);
  } else {
    this.driverMarker.setLatLng([driverLat, driverLng]);
  }

  // Tambahkan atau update marker customer (user)
  if (!this.userMarker) {
    this.showUserMarker(this.pickupLat, this.pickupLng);
  }

  // 🔥 FIT ALL MARKERS
  const bounds = L.latLngBounds([
    [driverLat, driverLng],
    [this.pickupLat, this.pickupLng]
  ]);
  this.map.fitBounds(bounds, { padding: [50, 50] });

  // 🧭 Ambil jalur rute dari driver ke customer
  this.routeService.getRoute(driverLng, driverLat, this.pickupLng, this.pickupLat).subscribe({
    next: (res) => {
      const geojsonRoute = res.features?.[0];
      if (!geojsonRoute) return;

      // Hapus rute lama kalau ada
      if (this.routeLayer) this.map.removeLayer(this.routeLayer);

      // Tambah rute baru
      this.routeLayer = L.geoJSON(geojsonRoute, {
        style: {
          color: '#007bff',
          weight: 4
        }
      }).addTo(this.map);
    },
    error: err => console.error('❌ Gagal ambil rute:', err)
  });
}



showUserMarker(lat: number, lng: number) {
  if (!this.mapInitialized) return; // ⬅️ Pindah ke paling atas dulu

  if (this.userMarker) this.map.removeLayer(this.userMarker);

  this.userMarker = L.marker([lat, lng], {
    icon: L.icon({
      iconUrl: 'https://cdn-icons-png.flaticon.com/512/149/149060.png',
      iconSize: [35, 35]
    })
  })
    .addTo(this.map)
    .bindPopup(`Titik Jemput:<br>${this.pickupAddress}`)
    .openPopup();
}




  getLabel(method: string): string {
    switch (method) {
      case 'tunai': return 'Tunai';
      case 'transfer': return 'Transfer Bank';
      case 'ewallet': return 'E-Wallet';
      default: return 'Belum dipilih';
    }
  }

  private setLeafletIcons() {
  // Reset _getIconUrl bawaan Leaflet
  delete (L.Icon.Default.prototype as any)._getIconUrl;

  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  });
}


  calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371;
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }

  calculateEstimatedTime(distanceKm: number, speedKmh: number = 40): number {
    const timeHours = distanceKm / speedKmh;
    return timeHours * 60;
  }

  startPollingDriverArrival() {
    this.pollingSubscription = interval(5000).subscribe(() => {
      this.cekPosisiDriverDanNotifikasi();
    });
  }


  cekPosisiDriverDanNotifikasi() {
    if (!this.driver || !this.driver.latitude || !this.driver.longitude) return;

    const distance = this.calculateDistance(
      this.driver.latitude,
      this.driver.longitude,
      this.pickupLat,
      this.pickupLng
    );

    if (distance < 0.1 && !this.arrivalNotified) {
    this.arrivalNotified = true;
    this.showToast('Driver telah tiba di titik jemput');

    this.kirimStatusKeBackend('dijemput'); // ✅ panggil API Laravel
}

  }

  kirimStatusKeBackend(status: string) {
  this.orderServices.updatePerjalanan(this.orderId, status).subscribe({
    next: () => console.log('✅ Status perjalanan dikirim:', status),
    error: (err) => console.error('❌ Gagal kirim status ke backend:', err)
  });
}

formatStatus(status: string | null | undefined): string {
  if (!status) return 'Status belum tersedia';
  return status.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}


  

  async showToast(message: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 4000,
      position: 'top',
      color: 'success'
    });
    await toast.present();
  }

  lanjutkanKeSampaiTujuan() {
    this.router.navigate(['/sampaitujuan'], {
      queryParams: {
        foto: this.driver?.foto || 'assets/img/default-driver.png',
        nama: this.driver?.nama || '',
        rating: this.driver?.rating || '0',
        merk: this.driver?.kendaraan_merk || '',
        warna: this.driver?.kendaraan_warna || '',
        plat: this.driver?.plat_nomor || '',
        driverId: this.driver?.id || '',
        driverNama: this.driver?.nama || '',
        pickupAddress: this.pickupAddress,
        destinationAddress: this.destinationAddress,
        ongkosKirim: this.ongkosKirim,
        biayaAdmin: this.biayaAdmin,
        pajak: this.pajak,
        totalHarga: this.totalHarga,
        metodePembayaran: this.metodePembayaran,
        jarakTempuh: this.jarakTempuh,
        waktuTempuh: this.waktuTempuh
      }
    });
  }

  listenToDriverRealtime() {
  const driverId = this.driver?.id;
  if (!driverId) return;

  const db = getDatabase();
  const statusRef = ref(db, `orderTracking/${this.orderId}/status`);
  const locationRef = ref(db, `lokasi_driver/${this.orderId}`);

  // ⬇️ Pantau lokasi
  onValue(locationRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
  const lat = data.lat;
  const lng = data.lng;

  if (lat === undefined || lng === undefined) {
      console.warn('⚠️ Data lokasi driver tidak lengkap:', data);
      return;
    }
  console.log('📍 Data lokasi driver dari Firebase:', data);
  this.driver.latitude = lat;
  this.driver.longitude = lng;
 

  this.updateMap(lat, lng);

  const distance = this.calculateDistance(lat, lng, this.pickupLat, this.pickupLng);
  this.distanceToDriver = distance.toFixed(2);
} else {
  console.warn('⚠️ Data lokasi driver tidak lengkap:', data);
}
  })

  // ⬇️ Pantau status perjalanan
  onValue(statusRef, (snapshot) => {
    const newStatus = snapshot.val();
    console.log('📦 Status perjalanan diperbarui:', newStatus);

    this.updateStatusDisplay(newStatus);
  });
}

updateStatusDisplay(status: string) {
  this.statusPerjalanan = status;
}



showDriverInfoPopup(lat: number, lng: number, text: string) {
  this.map.setView([lat, lng], 15);
  L.marker([lat, lng], {
    icon: L.icon({
      iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
      iconSize: [30, 30]
    })
  })
    .addTo(this.map)
    .bindPopup(text)
    .openPopup();
}



  batalKeBeranda() {
    this.router.navigate(['/beranda']);
  }

  openChat() {
    this.router.navigate(['/chat'], { queryParams: { from: 'dapatdriver' } });
  }
}
