import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { IonicModule, ToastController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import * as L from 'leaflet';
import { Subscription, interval } from 'rxjs';

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

  ongkosKirim: number = 0;
  biayaAdmin: number = 0;
  pajak: number = 0;
  totalHarga: number = 0;

  jarakTempuh: string = '';
  waktuTempuh: string = '';

  arrivalNotified: boolean = false;
  pollingSubscription?: Subscription;

  constructor(
    private router: Router,
    private http: HttpClient,
    private route: ActivatedRoute,
    private toastCtrl: ToastController
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

      if (this.pickupLat && this.pickupLng && this.destinationLat && this.destinationLng) {
        const distance = this.calculateDistance(this.pickupLat, this.pickupLng, this.destinationLat, this.destinationLng);
        this.jarakTempuh = distance.toFixed(2) + ' Km';
        const waktu = this.calculateEstimatedTime(distance);
        this.waktuTempuh = Math.round(waktu) + ' Menit';
      }
    });

    this.loadDriverOrder();
    this.startPollingDriverArrival();
  }

  ngAfterViewInit() {
    this.initMap();
  }

  ngOnDestroy() {
    if (this.pollingSubscription) {
      this.pollingSubscription.unsubscribe();
    }
  }

  loadDriverOrder() {
    this.http.get<any[]>('https://api.example.com/order/available-drivers').subscribe({
      next: (data) => {
        if (Array.isArray(data)) {
          const filtered = data.find(d => d.kendaraan_jenis === this.jenisKendaraan);

          if (filtered) {
            this.driver = filtered;

            if (this.driver?.foto && !this.driver.foto.startsWith('http')) {
              this.driver.foto = 'https://api.example.com/images/drivers/' + this.driver.foto;
            }

            if (!this.driver.foto) {
              this.driver.foto = 'assets/img/default-driver.png';
            }

            if (this.driver.latitude && this.driver.longitude) {
              this.updateMap(this.driver.latitude, this.driver.longitude);
            }
          } else {
            console.warn('Tidak ada driver yang cocok untuk kendaraan:', this.jenisKendaraan);
            this.driver = null;
          }
        }
      },
      error: (err) => {
        console.error('Gagal load data driver', err);
        this.driver = null;
      }
    });
  }

  initMap() {
    this.map = L.map('map').setView([-6.3107, 107.3176], 15);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);
  }

  updateMap(lat: number, lng: number) {
    this.map.setView([lat, lng], 15);
    L.marker([lat, lng]).addTo(this.map)
      .bindPopup(`Driver: ${this.driver.nama}`)
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
    }
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

  batalKeBeranda() {
    this.router.navigate(['/beranda']);
  }

  openChat() {
    this.router.navigate(['/chat'], {
      queryParams: {
        driverId: this.driver?.id || '',
        driverNama: this.driver?.nama || '',
        from:'dapatdriver'
      }
    });
  }
}
