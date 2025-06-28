import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { IonicModule, ToastController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { RouteService } from '../services/route.service';
import { Subscription, interval } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-sampaitujuan',
  standalone: true,
  imports: [IonicModule, CommonModule],
  templateUrl: './sampaitujuan.page.html',
  styleUrls: ['./sampaitujuan.page.scss'],
})
export class SampaitujuanPage implements OnInit, OnDestroy {

  foto: string = 'assets/img/default-driver.png';
  nama: string = '';
  rating: string = '';
  merk: string = '';
  warna: string = '';
  plat: string = '';

  pickupAddress: string = '';
  destinationAddress: string = '';

  ongkosKirim: number = 0;
  biayaAdmin: number = 0;
  pajak: number = 0;
  promoDiskon: number = 0;
  totalHarga: number = 0;
  metodePembayaran: string = '';

  jarakTempuh: string = '';
  waktuTempuh: string = '';

  orderId: string = '';  // order id untuk polling status

  private pollingSubscription: Subscription | undefined;
  private sudahNotified: boolean = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient,
    private toastCtrl: ToastController,
    private routeService: RouteService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.foto = params['photo'] || this.foto;
      this.nama = params['nama'] || 'Nama Driver';

      this.merk = params['merk'] || 'Merk';
      this.warna = params['warna'] || 'Warna';
      this.plat = params['plat'] || 'Plat';

      this.pickupAddress = params['pickupAddress'] || '';
      this.destinationAddress = params['destinationAddress'] || '';

      this.ongkosKirim = +params['ongkosKirim'] || 0;
      this.biayaAdmin = +params['biayaAdmin'] || 0;
      this.pajak = +params['pajak'] || 0;
      this.totalHarga = +params['totalHarga'] || 0;
      this.metodePembayaran = params['metodePembayaran'] || '';

      this.jarakTempuh = params['jarakTempuh'] || '';
      this.waktuTempuh = params['waktuTempuh'] || '';

      this.orderId = params['orderId'] || '';

      if (this.orderId) {
      this.http.get<any>(`https://localhost:8000/api/update-status/${this.orderId}`)
        .subscribe(order => {
          this.waktuTempuh = order.waktu_selesai
            ? new Date(order.waktu_selesai).toLocaleTimeString('id-ID', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
              })
            : '-';

          this.jarakTempuh = order.jarak_km?.toFixed(2) + ' km';
        }, err => {
          console.error('Gagal ambil detail order', err);
        });
    }    
    console.log('Waktu selesai:', this.waktuTempuh);
    console.log('Jarak tempuh:', this.jarakTempuh);

    });
  }

  ngOnDestroy() {
    if(this.pollingSubscription){
      this.pollingSubscription.unsubscribe();
    }
  }

  

  async showNotification() {
    const toast = await this.toastCtrl.create({
      message: 'Driver sudah sampai tujuan. Terima kasih telah menggunakan layanan kami!',
      duration: 5000,
      color: 'success',
      position: 'top'
    });
    toast.present();
  }

  


  getLabel(method: string): string {
    switch (method) {
      case 'ewallet': return 'Qris';
      default: return method;
    }
  }

  goToBeranda() {
    this.router.navigate(['/beranda'], {
      queryParams: {
        nama: this.nama,
        foto: this.foto,
        kendaraan: `${this.merk} - ${this.warna}`
      }
    });
  }

  openChat() {
    this.router.navigate(['/chat'], {
      queryParams: {
        driverNama: this.nama,
        driverFoto: this.foto,
        from: 'sampaitujuan'
      }
    });
  }
}
