import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import * as L from 'leaflet';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrderService } from 'src/app/services/order.service';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { AlertController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';



@Component({
  selector: 'app-pesanojol',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  templateUrl: './pesanojol.page.html',
  styleUrls: ['./pesanojol.page.scss'],
})
export class PesanojolPage implements OnInit, AfterViewInit {
  private map!: L.Map;
  private userMarker!: L.Marker;
  pickupMarker?: L.Marker;
  destinationMarker?: L.Marker;

  selectedPoint: 'pickup' | 'destination' = 'pickup';
  pickupPoint: { lat: number; lng: number } | null = null;
  destinationPoint: { lat: number; lng: number } | null = null;
  pickupAddress: string = '';
  destinationAddress: string = '';
  jenisKendaraan: string = '';
  estimasiTarif: number = 0;
  jarakKm: number = 0;
  biayaAdmin = 0;
  pajak = 0;
  totalHarga = 0;

  loadingPesanOjol = false;
  
  pickupSuggestions: any[] = [];
  destinationSuggestions: any[] = [];

  searchInput$ = new Subject<{ query: string; type: 'pickup' | 'destination' }>();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private orderService: OrderService,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.jenisKendaraan = params['kendaraan'] || '';
    });

    this.searchInput$.pipe(debounceTime(500)).subscribe(({ query, type }) => {
      this.fetchAddress(query, type);
    });
  }

  ngAfterViewInit() {
  setTimeout(() => {
    this.destroyMapIfExists();  // ✅ penting
    this.setLeafletIcons();
  }, 300);
}

  ionViewDidEnter() {
  this.initMapSafely();
  this.resetFormData();
}

  ionViewWillLeave() {
    if (this.map) {
    this.map.off();
    this.map.remove();
    this.map = undefined as any;
  }
  }

  

  private initMapSafely() {
  const mapContainer = document.getElementById('map-pesan');
  if (!mapContainer) return;

  // Jika map container sudah digunakan Leaflet, reset ID-nya
  if ((mapContainer as any)._leaflet_id) {
    delete (mapContainer as any)._leaflet_id;
  }

  // Jika peta sudah ada, hapus
  if (this.map) {
    this.map.off();
    this.map.remove();
    this.map = undefined as any;
  }

  // Sekarang baru aman untuk buat ulang peta
  this.setLeafletIcons();
  this.initMap();
}

private destroyMapIfExists() {
  const mapEl = document.getElementById('map-pesan'); // atau map-pesano
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

  private initMap(): void {
    this.destroyMapIfExists();
    this.map = L.map('map-pesan').setView([-6.319503, 107.293265], 16);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenTopoMap contributors'
    }).addTo(this.map);

    setTimeout(() => {
    this.map.invalidateSize();
  }, 300);
  }

  onSearchInput(query: string, type: 'pickup' | 'destination') {
    this.searchInput$.next({ query, type });
  }

  fetchAddress(query: string, type: 'pickup' | 'destination') {
    if (!query || query.length < 3) {
      if (type === 'pickup') this.pickupSuggestions = [];
      else this.destinationSuggestions = [];
      return;
    }

    const url = `http://127.0.0.1:8000/api/proxy-search?q=${encodeURIComponent(query)}`;
    fetch(url)
      .then(res => res.json())
      .then(data => {
        if (type === 'pickup') this.pickupSuggestions = data;
        else this.destinationSuggestions = data;
      })
      .catch(err => {
        console.error('❌ Error fetch alamat:', err);
        if (type === 'pickup') this.pickupSuggestions = [];
        else this.destinationSuggestions = [];
      });
  }

  selectAddress(address: any, type: 'pickup' | 'destination') {
    const lat = parseFloat(address.lat);
    const lng = parseFloat(address.lon);

    if (type === 'pickup') {
      this.pickupAddress = address.display_name;
      this.pickupPoint = { lat, lng };
      this.pickupSuggestions = [];

      if (this.pickupMarker) this.map.removeLayer(this.pickupMarker);
      this.pickupMarker = L.marker([lat, lng], { draggable: true }).addTo(this.map)
        .bindPopup(`Titik Jemput<br>${this.pickupAddress}`).openPopup();

      this.pickupMarker.on('dragend', async (event) => {
        const position = event.target.getLatLng();
        this.pickupPoint = { lat: position.lat, lng: position.lng };
        this.pickupAddress = await this.reverseGeocode(position.lat, position.lng);
        event.target.setPopupContent(`Titik Jemput<br>${this.pickupAddress}`).openPopup();
      });

      this.map.setView([lat, lng], 16);
      this.selectedPoint = 'destination';
    } else {
      this.destinationAddress = address.display_name;
      this.destinationPoint = { lat, lng };
      this.destinationSuggestions = [];

      if (this.destinationMarker) this.map.removeLayer(this.destinationMarker);
      this.destinationMarker = L.marker([lat, lng], { draggable: true }).addTo(this.map)
        .bindPopup(`Titik Tujuan<br>${this.destinationAddress}`).openPopup();

      this.destinationMarker.on('dragend', async (event) => {
        const position = event.target.getLatLng();
        this.destinationPoint = { lat: position.lat, lng: position.lng };
        this.destinationAddress = await this.reverseGeocode(position.lat, position.lng);
        event.target.setPopupContent(`Titik Tujuan<br>${this.destinationAddress}`).openPopup();
        this.cekEstimasiTarif();
      });

      this.map.setView([lat, lng], 16);
      this.selectedPoint = 'pickup';
      this.cekEstimasiTarif();
    }
  }

  reverseGeocode(lat: number, lng: number): Promise<string> {
    const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`;
    return fetch(url)
      .then(res => res.json())
      .then(data => data.display_name || 'Alamat tidak ditemukan')
      .catch(() => 'Alamat tidak ditemukan');
  }

  getCurrentLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        this.map.setView([lat, lng], 18);

        // Buat alamat berdasarkan koordinat
        const address = await this.reverseGeocode(lat, lng);

        this.pickupPoint = { lat, lng };
        this.pickupAddress = address;

        if (this.userMarker) this.map.removeLayer(this.userMarker);
        this.userMarker = L.marker([lat, lng])
          .addTo(this.map)
          .bindPopup('Lokasi Anda sekarang').openPopup();

        // Tambahkan marker jemput juga (biar bisa dipakai langsung)
        if (this.pickupMarker) this.map.removeLayer(this.pickupMarker);
        this.pickupMarker = L.marker([lat, lng], { draggable: true }).addTo(this.map)
          .bindPopup(`Titik Jemput<br>${this.pickupAddress}`).openPopup();

        this.pickupMarker.on('dragend', async (event) => {
          const position = event.target.getLatLng();
          this.pickupPoint = { lat: position.lat, lng: position.lng };
          this.pickupAddress = await this.reverseGeocode(position.lat, position.lng);
          event.target.setPopupContent(`Titik Jemput<br>${this.pickupAddress}`).openPopup();
        });

        this.selectedPoint = 'destination';
      },
      (error) => {
        console.error('Gagal mendapatkan lokasi:', error);
        alert('Gagal mendapatkan lokasi Anda. Pastikan GPS aktif.');
      }
    );
  } else {
    alert('Geolocation tidak didukung di browser ini.');
  }
}


  cekEstimasiTarif() {
  if (!this.pickupPoint || !this.destinationPoint) return;

  this.orderService.cekTarif({
    jemput_latitude: this.pickupPoint.lat,
    jemput_longitude: this.pickupPoint.lng,
    tujuan_latitude: this.destinationPoint.lat,
    tujuan_longitude: this.destinationPoint.lng,
    tipe_kendaraan: this.jenisKendaraan 
  }).subscribe(res => {
    console.log('✅ Estimasi tarif:', res.estimasi_tarif);
    console.log('✅ Jarak:', res.jarak_km);
    console.log('✅ Driver terdekat:', res.driver_terdekat);
    console.log('Tipe kendaraan yang dikirim:', this.jenisKendaraan);


    this.estimasiTarif = res.estimasi_tarif;
    this.biayaAdmin = res.biaya_admin;
    this.pajak = res.pajak;
    this.totalHarga = res.total_harga;
    

  });
}



  lanjutKeDetail() {
  if (!this.pickupPoint || !this.destinationPoint) {
    alert('Silakan pilih titik jemput dan tujuan.');
    return;
  }

  if (!this.pickupAddress || !this.destinationAddress) {
    alert('Alamat jemput dan tujuan wajib diisi.');
    return;
  }

  this.loadingPesanOjol = true;

  this.orderService.cekTarif({
  jemput_latitude: this.pickupPoint.lat,
  jemput_longitude: this.pickupPoint.lng,
  tujuan_latitude: this.destinationPoint.lat,
  tujuan_longitude: this.destinationPoint.lng,
  tipe_kendaraan: this.jenisKendaraan 
}).subscribe(res => {
  this.estimasiTarif = res.estimasi_tarif;
  this.biayaAdmin = res.biaya_admin;
  this.pajak = res.pajak;
  this.totalHarga = res.total_harga;
  this.jarakKm = res.jarak_km;

  console.log('✅ Siap navigasi dengan:', {
    estimasiTarif: this.estimasiTarif,
    jarakKm: this.jarakKm,
    biayaAdmin: this.biayaAdmin,
    pajak: this.pajak,
    totalHarga: this.totalHarga
  });

  this.router.navigate(['/detailpemesanan'], {
    queryParams: {
      pickupLat: this.pickupPoint!.lat,
      pickupLng: this.pickupPoint!.lng,
      destLat: this.destinationPoint!.lat,
      destLng: this.destinationPoint!.lng,
      pickupAddress: this.pickupAddress,
      destinationAddress: this.destinationAddress,
      kendaraan: this.jenisKendaraan,
      estimasiTarif: this.estimasiTarif,
      jarakKm: this.jarakKm,
      biayaAdmin: this.biayaAdmin,
      pajak: this.pajak,
      totalHarga: this.totalHarga
    }
  });

  }, err => {
    console.error('❌ Gagal hitung tarif saat lanjut:', err);
    alert('Gagal menghitung tarif. Silakan coba lagi.');
  })
  .add(() => {
      this.loadingPesanOjol = false; // ✅ SELESAI LOADING (sukses atau gagal)
    });

}

formLengkap(): boolean {
  return !!(
    this.pickupPoint &&
    this.destinationPoint &&
    this.pickupAddress &&
    this.destinationAddress &&
    this.pickupAddress.trim() !== '' &&
    this.destinationAddress.trim() !== ''
   
  );
}

private resetFormData() {
  this.pickupPoint = null;
  this.destinationPoint = null;
  this.pickupAddress = '';
  this.destinationAddress = '';
  this.pickupSuggestions = [];
  this.destinationSuggestions = [];
  this.estimasiTarif = 0;
  this.jarakKm = 0;
  this.biayaAdmin = 0;
  this.pajak = 0;
  this.totalHarga = 0;

  this.selectedPoint = 'pickup';

  // hapus marker juga
  if (this.pickupMarker) {
    this.map?.removeLayer(this.pickupMarker);
    this.pickupMarker = undefined;
  }

  if (this.destinationMarker) {
    this.map?.removeLayer(this.destinationMarker);
    this.destinationMarker = undefined;
  }
}


async showToast(
  message: string,
  color: 'success' | 'danger' | 'warning' | 'primary' = 'primary',
  duration: number = 2000, // 2 detik
  position: 'bottom' | 'top' | 'middle' = 'bottom'
) {
  const toast = await this.toastCtrl.create({
    message,
    duration,
    position,
    color,
    buttons: [
      {
        text: '×',
        role: 'cancel',
        side: 'end'
      }
    ]
  });
  await toast.present();
}





  goBack() {
    this.router.navigate(['/beranda']);
  }
}
