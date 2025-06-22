import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { Geolocation } from '@capacitor/geolocation';
import { RouteService } from '../services/route.service';
import { getDatabase, ref, set } from 'firebase/database';
import { FirebaseLocationService } from '../services/firebase-location.service';
import { OrderService } from '../services/order.service';
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
  driverMarker: any;
  customerMarker: any;
  routeLayer: any;

  pickupLat = 0;
  pickupLng = 0;
  customerNama = '';
  distanceToCustomer: string = '';
  driverLat: number = 0;
  driverLng: number = 0;
  destinationLat: number = 0;
  destinationLng: number = 0;
  driverId: number = 0;



  alamatJemput: string = '';
  alamatTujuan: string = '';
  totalHarga: number = 0;
  alreadyNavigated: boolean = false;
  orderId: number = 0;
  customerPhoto: string | null = null;
  customer: any = {}; // ⬅️ Tambahkan ini di atas constructor
  




  


  constructor(
    private route: ActivatedRoute, 
    private router: Router, 
    private routeService : RouteService,
    private firebaseLocation : FirebaseLocationService,
    private orderService : OrderService
  ) {}

  ngOnInit() {
  this.route.queryParams.subscribe(params => {
    this.orderId = +params['orderId'] || 0;
    this.customerNama = params['nama'] || '-';
    this.alamatJemput = params['pickupAddress'] || '-';
    this.alamatTujuan = params['destinationAddress'] || '-';
    this.totalHarga = +params['totalHarga'] || 0;
    this.pickupLat = +params['pickupLat'] || 0;
    this.pickupLng = +params['pickupLng'] || 0;
    this.customerPhoto = params['photo'];
    this.destinationLat = +params['destinationLat'] || 0;
    this.destinationLng = +params['destinationLng'] || 0;
    this.driverId = +params['driverId'] || 0;


    console.log('✅ Customer Nama:', this.customerNama);
    console.log('✅ Customer Photo:', this.customerPhoto);
    console.log('✅ Lokasi Customer:', this.pickupLat, this.pickupLng);
    console.log('🧾 Semua queryParams:', params);
    console.log('🚩 Received destinationLat from params:', params['destinationLat']);
    console.log('🚩 Received destinationLng from params:', params['destinationLng']);
     console.log('params destination:', params['destinationLat'], params['destinationLng'])

  });
  
}

ngAfterViewInit() {
  setTimeout(() => {
    this.initMap(); // Map baru dibuat saat view sudah benar-benar tersedia
  }, 300);
}



  async initMap(retry = 0) {
  try {
    this.map = L.map('map-jemput-penumpang').setView([this.pickupLat, this.pickupLng], 15);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    this.customerMarker = L.marker([this.pickupLat, this.pickupLng], {
      icon: L.icon({
        iconUrl: 'https://cdn-icons-png.flaticon.com/512/149/149059.png',
        iconSize: [30, 30],
        iconAnchor: [15, 30]
      })
    }).addTo(this.map).bindPopup('Titik Jemput Customer');

    // ✅ Ambil lokasi driver
    const pos = await Geolocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 20000,
      maximumAge: 0
    });

    const driverLat = pos.coords.latitude;
    const driverLng = pos.coords.longitude;

    this.driverMarker = L.marker([driverLat, driverLng], {
      icon: L.icon({
        iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
        iconSize: [30, 30],
        iconAnchor: [15, 30]
      })
    }).addTo(this.map).bindPopup('Posisi Anda');

    this.routeService.getRoute(driverLng, driverLat, this.pickupLng, this.pickupLat).subscribe({
      next: (res) => {
        const geojsonRoute = res.features?.[0];
        if (this.routeLayer) this.map.removeLayer(this.routeLayer);
        if (geojsonRoute) {
          this.routeLayer = L.geoJSON(geojsonRoute, {
            style: { color: '#2c7be5', weight: 5 }
          }).addTo(this.map);
        }
      },
      error: (err) => console.error('❌ Gagal ambil rute:', err)
    });

    setTimeout(() => this.map.invalidateSize(), 300);
    this.startRealtimeLocationUpdate();
  } catch (err) {
    console.error(`❌ Gagal ambil lokasi driver (percobaan ke-${retry + 1}):`, err);
    if (retry < 2) {
      setTimeout(() => this.initMap(retry + 1), 3000); // retry setelah 3 detik
    } else {
      alert('Gagal mendapatkan lokasi. Pastikan GPS aktif dan izin lokasi diberikan.');
    }
  }
}


  

  tampilkanRute(startLng: number, startLat: number, endLng: number, endLat: number) {
  console.log('Rute dari:', startLat, startLng, 'ke', endLat, endLng);

  this.routeService.getRoute(startLng, startLat, endLng, endLat).subscribe({
    next: (res) => {
      console.log('✅ Rute diterima:', res);

      const geojsonRoute = res.features?.[0]; // ✅ ambil fitur pertama

      if (!geojsonRoute) {
        console.warn('⚠️ GeoJSON kosong atau tidak valid');
        return;
      }

      if (this.routeLayer) this.map.removeLayer(this.routeLayer);

      this.routeLayer = L.geoJSON(geojsonRoute, {
        style: {
          color: '#2c7be5',
          weight: 5
        }
      }).addTo(this.map);
    },
    error: (err) => {
      console.error('❌ Gagal ambil rute:', err);
    }
  });
}




  startRealtimeLocationUpdate() {
  const orderId = +this.route.snapshot.queryParams['orderId'];

  setInterval(async () => {
    try {
      const position = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 30000, // 30 detik
        maximumAge: 0
      })

      const lat = position.coords.latitude;
      const lng = position.coords.longitude;

      if (this.driverMarker) {
        this.driverMarker.setLatLng([lat, lng]);
      }

      // ✅ Kirim ke Firebase realtime
      this.firebaseLocation.updateDriverLocation(orderId, lat, lng);
      console.log('📤 Kirim lokasi ke Firebase:', orderId, lat, lng);
 
      // ✅ Cek jarak
      const distance = this.hitungJarak(lat, lng, this.pickupLat, this.pickupLng);
      this.distanceToCustomer = distance.toFixed(2) + ' km';

      if (distance < 0.05 && !this.alreadyNavigated) {
        this.alreadyNavigated = true;
        this.kirimStatus('dijemput');
        // ✅ Tampilkan toast opsional / bisa kasih notif visual di halaman
        console.log('✅ Dekat dengan customer, tunggu driver klik tombol.');
      }

      // Refresh route ke customer
      this.tampilkanRute(lng, lat, this.pickupLng, this.pickupLat);

    } catch (err) {
      console.error('❌ Gagal ambil lokasi:', err);
    }
  }, 5000);
}


kirimStatus(status: string) {
  this.orderService.updatePerjalanan(this.orderId, status)
    .subscribe({
      next: () => console.log('✅ Status updated:', status),
      error: err => console.error('❌ Gagal update status:', err)
    });
}


  updateDriverLocationRealtime(orderId: number, lat: number, lng: number) {
     this.firebaseLocation.updateDriverLocation(this.orderId, lat, lng);
  
}
  updateStatus(status: string) {
  this.firebaseLocation.updateStatus(this.orderId, status);
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



  menujuCustomer() {
  this.kirimStatus('dalam_perjalanan'); 
  this.updateStatus('dalam_perjalanan');
  console.log('🚀 Destination yang akan dikirim:', this.destinationLat, this.destinationLng);

  this.router.navigate(['/penumpangnaik'], {
    queryParams: {
      
      nama: this.customerNama || '-',
      pickupLat: this.pickupLat,
      pickupLng: this.pickupLng,
      pickupAddress: this.alamatJemput,
      destinationLat: this.destinationLat,
      destinationLng: this.destinationLng,
      destinationAddress: this.alamatTujuan,
      totalHarga: this.totalHarga,
      driverId: this.driverId,
      orderId: this.orderId,

      
    }
  });
}



  bukaChat() {
    this.router.navigate(['/chat'], {
      queryParams: { from: 'jemputpenumpang' }
    });
  }
}
