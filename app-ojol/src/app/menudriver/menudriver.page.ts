import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule, ToastController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { NavController } from '@ionic/angular';
import { Geolocation } from '@capacitor/geolocation';
import { ProfileService } from 'src/app/services/profile.service';
import { MenudriverService  } from 'src/app/services/menudriver.service';
import { OrderService  } from 'src/app/services/order.service';
import { interval, Subscription } from 'rxjs';
import { AlertController } from '@ionic/angular';


@Component({
  selector: 'app-menudriver',
  standalone: true,
  imports: [IonicModule, CommonModule],
  templateUrl: './menudriver.page.html',
  styleUrls: ['./menudriver.page.scss'],
})
export class MenudriverPage implements OnInit {
  latitude: number = 0;
  longitude: number = 0;
  profile: any = {};
  photoUrl: string | null = null;
  pollingOrderSubscription?: Subscription; // di class
  orderId: number = 0;
  tampilkanRequestCard = false;
  orderMasuk: any = null;


  constructor(
    private router: Router,
    private toastController: ToastController,
    private navCtrl: NavController,
    private profileService: ProfileService,
    private menuDriverService: MenudriverService,
    private orderService: OrderService,
    private alertCtrl: AlertController
  ) {}

  ngOnInit() {
    this.loadProfile(); // opsional di sini
    this.startPollingOrder();
  }

  ngOnDestroy() {
    this.stopPollingOrder();
  }

  startPollingOrder() {
    this.pollingOrderSubscription = interval(5000).subscribe(() => {
      this.cekOrderMasuk();
    });
  }

  stopPollingOrder() {
    this.pollingOrderSubscription?.unsubscribe();
  }
  
  loadProfile() {
    this.profileService.getProfile().subscribe({
      next: (res) => {
        this.profile = res;
        this.photoUrl = res.photo || null;
      },
      error: (err) => {
        console.error('❌ Gagal ambil profil:', err);
      }
    });
    this.getCurrentLocation();
  }
  
  ionViewWillEnter() {
    this.loadProfile();
  }

  async getCurrentLocation() {
    try {
      const position = await Geolocation.getCurrentPosition();
      this.latitude = position.coords.latitude;
      this.longitude = position.coords.longitude;
      console.log('📍 Lokasi Driver:', this.latitude, this.longitude);

      this.menuDriverService.getCurrentLocation(this.latitude, this.longitude).subscribe({
        next: (res) => {
          console.log('✅ Lokasi berhasil dikirim ke backend:', res);
        },
        error: (err) => {
          console.error('❌ Gagal kirim lokasi:', err);
        }
      });
    } catch (error) {
      console.error('❌ Gagal ambil lokasi:', error);
      alert('Gagal mendapatkan lokasi. Pastikan izin lokasi aktif.');
    }
  }

  toggleAktif(event: any) {
    const aktif = event.detail.checked;
  
    this.menuDriverService.updateStatus(aktif).subscribe({
      next: () => {
        console.log('✅ Status driver diupdate ke:', aktif);
      },
      error: (err) => {
        console.error('❌ Gagal update status driver:', err);
      }
    });

  }

  cekOrderMasuk() {
    const driverId = localStorage.getItem('user_id');
    if (!driverId) return;
  
    this.menuDriverService.getOrderTerbaru(driverId).subscribe({
      next: (res) => {
        if (res && res.order) {
          this.orderMasuk = res.order;
          this.orderId = res.order.id; // simpan orderId juga
          this.tampilkanRequestCard = true; // tampilkan kartu permintaan
        } else {
          this.tampilkanRequestCard = false;
          this.orderMasuk = null;
        }
      },
      error: (err) => {
        console.error('❌ Gagal cek order masuk:', err);
      }
    });
  }
  
  
  async tampilkanAlertOrder(order: any) {
    const alert = await this.alertCtrl.create({
      header: 'Order Masuk!',
      message: `
        <strong>Dari:</strong> ${order.lokasi_jemput}<br>
        <strong>Tujuan:</strong> ${order.lokasi_tujuan}<br>
        <strong>Tarif:</strong> Rp ${order.tarif}
      `,
      buttons: [
        {
          text: 'Tolak',
          role: 'cancel',
          handler: () => {
            console.log('❌ Order ditolak');
            // opsional: panggil API untuk update status
          }
        },
        {
          text: 'Terima',
          handler: () => {
            this.terimaOrder(order.id);
          }
        }
      ]
    });
  
    await alert.present();
  }

  terimaOrder(orderId: number) {
    const driverId = parseInt(localStorage.getItem('user_id') || '0');
  
    this.menuDriverService.terimaOrder({
      order_id: orderId,
      driver_id: driverId
    }).subscribe({
      next: (res) => {
        console.log('✅ Order diterima:', res);
        this.router.navigate(['/antarpenumpang'], {
          queryParams: {
            orderId: orderId
          }
        });
      },
      error: (err) => {
        console.error('❌ Gagal terima order:', err);
      }
    });
  }
  
  
  

  // tampilkanQRIS() {
   // const payload = {
     // order_id: this.orderId // id dari order yang sudah dibuat
   // };
  
   // fetch('http://localhost:8000/api/midtrans/token', {
    //  method: 'POST',
    //  headers: { 'Content-Type': 'application/json' },
    //  body: JSON.stringify(payload)
   // })
      //.then(res => res.json())
      //.then(data => {
      //  if (data.token) {
       //   window.snap.pay(data.token, {
       //     onSuccess: result => {
       //       console.log('✅ Pembayaran sukses', result);
       //       alert('Pembayaran berhasil!');
       //     },
       //     onPending: result => {
       //       console.log('⏳ Pembayaran pending', result);
        //      alert('Menunggu konfirmasi pembayaran.');
       //     },
        //    onError: error => {
        //      console.error('❌ Gagal bayar', error);
        //      alert('Terjadi kesalahan saat pembayaran.');
          //  }
        //  });
      //  } else {
       //   alert('Gagal mendapatkan Snap token.');
     //   }
    //  })
   //   .catch(err => {
     //   console.error('❌ Error Midtrans token fetch:', err);
   //   });
 // }
  

 
 async tolakPermintaan() {
  this.orderService.batalkanOrder({
    order_id: this.orderId,
    dibatalkan_oleh: 'driver',
    alasan_batal: 'Tidak tersedia'
  }).subscribe({
    next: async () => {
      this.tampilkanRequestCard = false;
      this.orderMasuk = null;

      const toast = await this.toastController.create({
        message: 'Permintaan ditolak.',
        duration: 2000,
        color: 'danger',
      });
      toast.present();
    },
    error: async (err) => {
      console.error('❌ Gagal batalkan order:', err);
      const toast = await this.toastController.create({
        message: 'Gagal menolak permintaan.',
        duration: 2000,
        color: 'danger',
      });
      toast.present();
    }
  });
}

async terimaPermintaan() {
  const driverId = parseInt(localStorage.getItem('user_id') || '0');

  this.menuDriverService.terimaOrder({
    order_id: this.orderId,
    driver_id: driverId
  }).subscribe({
    next: async (res) => {
      this.tampilkanRequestCard = false;
      this.orderMasuk = null;

      const toast = await this.toastController.create({
        message: 'Permintaan diterima.',
        duration: 2000,
        color: 'success',
      });
      toast.present();

      this.router.navigate(['/antarpenumpang'], {
        queryParams: {
          orderId: this.orderId
        }
      });
    },
    error: async (err) => {
      console.error('❌ Gagal terima order:', err);
      const toast = await this.toastController.create({
        message: 'Gagal menerima permintaan.',
        duration: 2000,
        color: 'danger',
      });
      toast.present();
    }
  });
}


  goToActivity() {
    this.router.navigate(['/aktivitasdriver']);
  }

  goToIncome() {
    this.router.navigate(['/pendapatan']);
  }

  goToSettings() {
    this.router.navigate(['/pengaturandriver']);
  }

  goToHome() {
    this.router.navigate(['/menudriver']);
  }
  
  goToRiwayat() {
  this.router.navigate(['/riwayatlayanan']);
  }
  
  goToProfilDriver() {
  this.navCtrl.navigateForward('/profildriver');
}
  lihatRute() {
  console.log('Tombol "Lihat Rute" diklik');
  // Tambahkan logika di sini, contoh:
  // this.router.navigate(['/rute']); atau buka peta
  }
  
}
