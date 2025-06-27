import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as L from 'leaflet';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { OrderService } from '../services/order.service';

@Component({
  selector: 'app-detailpemesanan',
  standalone: true,
  imports: [IonicModule, CommonModule],
  templateUrl: './detailpemesanan.page.html',
  styleUrls: ['./detailpemesanan.page.scss'],
})
export class DetailpemesananPage implements OnInit {
  pickupLat = 0;
  pickupLng = 0;
  destinationLat = 0;
  destinationLng = 0;
  pickupAddress = '';
  destinationAddress = '';
  jenisKendaraan = '';
  selectedMethod = '';
  showPaymentOptions = false;

 
  driverList: any[] = [];
  estimasiTarif = 0;
  biayaAdmin = 0;
  pajak = 0;
  totalHarga = 0;
  jarakKm = 0;

  private map!: L.Map;
  private pickupMarker!: L.Marker;
  private destinationMarker!: L.Marker;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private orderService: OrderService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.pickupLat = +params['pickupLat'] || 0;
      this.pickupLng = +params['pickupLng'] || 0;
      this.destinationLat = +params['destLat'] || 0;
      this.destinationLng = +params['destLng'] || 0;
      this.pickupAddress = params['pickupAddress'] || '';
      this.destinationAddress = params['destinationAddress'] || '';
      this.jenisKendaraan = params['kendaraan'] || '';
      this.estimasiTarif = +params['estimasiTarif'] || 0;
      this.biayaAdmin = +params['biayaAdmin'] || 0;
      this.pajak = +params['pajak'] || 0;
      this.totalHarga = +params['totalHarga'] || 0;
      this.jarakKm = +params['jarakKm'] || 0;
       this.driverList = params['driverTerdekat'] ? JSON.parse(params['driverTerdekat']) : [];

      console.log('🛰️ Pickup:', this.pickupLat, this.pickupLng);
      console.log('🎯 Destination:', this.destinationLat, this.destinationLng);
    });
  }

  ionViewDidEnter() {
  setTimeout(() => {
    this.destroyMapIfExists();
    this.setLeafletIcons();
    this.initMap();

    // 🔧 Tambahin ini biar ukuran map langsung sesuai
    setTimeout(() => this.map.invalidateSize(), 300);
  }, 100);
}



ngAfterViewInit() {
  setTimeout(() => {
    this.destroyMapIfExists(); // 🔥 Tambahkan ini dulu!
    this.setLeafletIcons();    // Optional: reset icon
  }, 300);
}




private destroyMapIfExists() {
  const mapEl = document.getElementById('map-detail'); // atau map-pesano
if (mapEl && (mapEl as any)._leaflet_id) {
  delete (mapEl as any)._leaflet_id;
}
if (this.map) {
  this.map.off();
  this.map.remove();
  this.map = undefined as any;
}
 
}




  private setLeafletIcons() {
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
      iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    });
  }

  private initMap() {

  const lat = this.pickupLat || -6.3;
  const lng = this.pickupLng || 107.3;

  this.map = L.map('map-detail').setView([lat, lng], 15);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors',
    maxZoom: 19
  }).addTo(this.map);

  // 🔴 Titik Jemput
  if (this.pickupLat && this.pickupLng) {
    const pickupLatLng = L.latLng(this.pickupLat, this.pickupLng);
    this.pickupMarker = L.marker(pickupLatLng, {
      icon: L.icon({
        iconUrl: 'https://cdn-icons-png.flaticon.com/512/2776/2776067.png', // Icon jemput
        iconSize: [30, 30],
        iconAnchor: [15, 30]
      })
    }).addTo(this.map).bindPopup('Titik Jemput').openPopup();
  }

  // 🟢 Titik Tujuan
  if (this.destinationLat && this.destinationLng) {
    const destLatLng = L.latLng(this.destinationLat, this.destinationLng);
    this.destinationMarker = L.marker(destLatLng, {
      icon: L.icon({
        iconUrl: 'https://cdn-icons-png.flaticon.com/512/2776/2776067.png', // Ganti icon tujuan kalau mau beda
        iconSize: [30, 30],
        iconAnchor: [15, 30]
      })
    }).addTo(this.map).bindPopup('Titik Tujuan').openPopup();
  }

  // 🗺️ Pusatkan ke tengah antara titik jemput dan tujuan (opsional)
  if (this.pickupLat && this.pickupLng && this.destinationLat && this.destinationLng) {
    const bounds = L.latLngBounds([
      [this.pickupLat, this.pickupLng],
      [this.destinationLat, this.destinationLng],
    ]);
    this.map.fitBounds(bounds, { padding: [50, 50] });
  }
}


  selectMethod(method: string) {
    this.selectedMethod = method;
    this.showPaymentOptions = false;
  }

  pesanSekarang() {
    if (!this.selectedMethod) {
      // Jika belum dipilih, langsung set default
      this.selectedMethod = 'Qris'; // atau 'transfer', 'ewallet', tergantung default kamu
    }

  
    const idPemesanan = new Date().getTime().toString();
  
    // ✅ CEK DATA SEBELUM KIRIM
    console.log('🔥 KIRIM DATA ORDER:', {
      tipe_kendaraan: this.jenisKendaraan,
    });
    const dataOrder = {
      jemput_latitude: this.pickupLat,
      jemput_longitude: this.pickupLng,
      tujuan_latitude: this.destinationLat,
      tujuan_longitude: this.destinationLng,
      lokasi_jemput: this.pickupAddress,
      lokasi_tujuan: this.destinationAddress,
      tipe_kendaraan: this.jenisKendaraan,
      user_id: +localStorage.getItem('user_id')!  // ✅ Ambil dari localStorage
    };
  
    console.log('📦 Data buat order:', dataOrder); // ✅ LOG untuk debugging
  
    // ✅ Kirim order ke backend
    this.orderService.buatOrder(dataOrder).subscribe(res => {
      this.router.navigate(['/menunggudriver'], {
        queryParams: {
          orderId: res.order.id,
          assignedDriver: res.assigned_driver,
          idPemesanan,
          pickupLat: this.pickupLat,
          pickupLng: this.pickupLng,
          destinationLat: this.destinationLat,
          destinationLng: this.destinationLng,
          pickupAddress: this.pickupAddress,
          destinationAddress: this.destinationAddress,
          metodePembayaran: this.selectedMethod,
          ongkosKirim: this.estimasiTarif,
          biayaAdmin: this.biayaAdmin,
          pajak: this.pajak,
          totalHarga: this.totalHarga,
          kendaraan: this.jenisKendaraan,
          driverList: JSON.stringify(res.driver_terdekat)
          
          
        }
      });
    }, err => {
      console.error('❌ Gagal buat order:', err);
      alert('Gagal membuat order. Silakan coba lagi.');
    });
  }
  
  

  getLabel(method: string): string {
  switch (method) {
    case 'tunai':
      return 'Tunai';
    case 'transfer':
      return 'Transfer Bank';
    case 'ewallet':
      return 'E-Wallet';
    default:
      return '';
  }
}

  goBack() {
    this.router.navigate(['/pesanojol']);
  }
}
