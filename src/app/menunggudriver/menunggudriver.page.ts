import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { IonicModule, AlertController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import * as L from 'leaflet';
import { Subscription, interval } from 'rxjs';
import { OrderService } from '../services/order.service';


@Component({
  selector: 'app-menunggudriver',
  standalone: true,
  imports: [IonicModule, CommonModule],
  templateUrl: './menunggudriver.page.html',
  styleUrls: ['./menunggudriver.page.scss'],
})
export class MenunggudriverPage implements OnInit, OnDestroy {
  pickupLat: number = 0;
  pickupLng: number = 0;
  destinationLat: number = 0;
  destinationLng: number = 0;
  pickupAddress: string = '';
  destinationAddress: string = '';
  selectedMethod: string = '';
  ongkosKirim: number = 0;
  biayaAdmin: number = 0;
  pajak: number = 0;
  totalHarga: number = 0;
  jenisKendaraan: string = '';
  orderId: number = 0;
  driverList: any[] = [];

  pollingSubscription?: Subscription;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient,
    private alertCtrl: AlertController,
    private orderService: OrderService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.orderId = parseInt(params['orderId']) || 0; // tambahkan ini
      this.pickupLat = parseFloat(params['pickupLat']) || 0;
      this.pickupLng = parseFloat(params['pickupLng']) || 0;
      this.destinationLat = parseFloat(params['destinationLat']) || 0;
      this.destinationLng = parseFloat(params['destinationLng']) || 0;
      this.pickupAddress = params['pickupAddress'] || '';
      this.destinationAddress = params['destinationAddress'] || '';
      this.selectedMethod = params['metodePembayaran'] || '';
      this.ongkosKirim = parseFloat(params['ongkosKirim']) || 0;
      this.biayaAdmin = parseFloat(params['biayaAdmin']) || 0;
      this.pajak = parseFloat(params['pajak']) || 0;
      this.totalHarga = parseFloat(params['totalHarga']) || 0;
      this.jenisKendaraan = params['kendaraan'] || '';

      if (params['driverList']) {
      try {
        this.driverList = JSON.parse(params['driverList']);
      } catch (e) {
        console.warn('❌ Gagal parsing driverList:', e);
        this.driverList = [];
      }
    }

      this.startPollingStatusDriver();
    });
  }

  ngOnDestroy() {
    this.stopPollingStatusDriver();
  }

  // Tombol Batalkan
  async batalkanPemesanan() {
    const alert = await this.alertCtrl.create({
      header: 'Konfirmasi',
      message: 'Apakah Anda yakin ingin membatalkan pemesanan?',
      buttons: [
        {
          text: 'Tidak',
          role: 'cancel'
        },
        {
          text: 'Ya, Batalkan',
          handler: () => {
            this.orderService.batalkanOrder({
              order_id: this.orderId,
              dibatalkan_oleh: 'customer',
              alasan_batal: 'Tidak jadi'
            }).subscribe(() => {
              this.stopPollingStatusDriver();
              this.tampilkanNotifikasi('Pesanan dibatalkan.');
              this.router.navigate(['/beranda']);
            }, err => {
              console.error('❌ Gagal membatalkan order:', err);
              this.tampilkanNotifikasi('Gagal membatalkan pesanan.');
            });
          }          
          }
      ]
    });
    await alert.present();
  }

  // Mulai polling cek status driver
  startPollingStatusDriver() {
    this.pollingSubscription = interval(5000).subscribe(() => {
      this.cekStatusDriver();
    });
  }

  stopPollingStatusDriver() {
    if (this.pollingSubscription) {
      this.pollingSubscription.unsubscribe();
      this.pollingSubscription = undefined;
    }
  }

  // Simulasi cek status driver dari backend
  cekStatusDriver() {
  if (!this.orderId) return;

  const token = localStorage.getItem('token') || '';
  const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };

  this.http.get<any>(
    `http://localhost:8000/api/order-status/${this.orderId}`,
    { headers }
  ).subscribe(res => {

    if (res.driver_candidates) {
    this.driverList = res.driver_candidates;
  }

    if (res.status === 'dibatalkan') {
      this.stopPollingStatusDriver();
      this.tampilkanNotifikasi(`Order dibatalkan oleh ${res.dibatalkan_oleh || 'sistem'}`);
      setTimeout(() => {
        this.router.navigate(['/beranda']);
      }, 2000);
      return;
    }

    if (res.driver_terdekat) {
      this.driverList = res.driver_terdekat;
    }

    if (res.driver_id !== null && res.status === 'dijemput') {
      this.stopPollingStatusDriver();
      this.tampilkanNotifikasi('Driver menerima pesanan');

      const queryParams = {
        pickupLat: this.pickupLat,
        pickupLng: this.pickupLng,
        destinationLat: this.destinationLat,
        destinationLng: this.destinationLng,
        pickupAddress: this.pickupAddress,
        destinationAddress: this.destinationAddress,
        metodePembayaran: this.selectedMethod,
        ongkosKirim: this.ongkosKirim,
        biayaAdmin: this.biayaAdmin,
        pajak: this.pajak,
        totalHarga: this.totalHarga,
        kendaraan: this.jenisKendaraan,
        orderId: this.orderId
      };

      setTimeout(() => {
        this.router.navigate(['/dapatdriver'], { queryParams });
      }, 2000);
    }
  }, err => {
    console.error('❌ Gagal cek status order:', err);
  });
}

  

  // Fungsi Notifikasi
  async tampilkanNotifikasi(pesan: string) {
    const alert = await this.alertCtrl.create({
      header: 'Notifikasi',
      message: pesan,
      buttons: ['OK']
    });
    await alert.present();
  }
}
