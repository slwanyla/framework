import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule, ToastController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { NavController } from '@ionic/angular';
import { Geolocation, Position } from '@capacitor/geolocation';
import { ProfileService } from 'src/app/services/profile.service';
import { MenudriverService  } from 'src/app/services/menudriver.service';
import { OrderService  } from 'src/app/services/order.service';
import { FirebaseLocationService } from '../services/firebase-location.service';
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
  watchId: string | null = null;
  lastLat: number = 0;
  lastLng: number = 0;
  loadingLokasi = true;
  lokasiBerhasil: boolean = false;




  constructor(
    private router: Router,
    private toastController: ToastController,
    private navCtrl: NavController,
    private profileService: ProfileService,
    private menuDriverService: MenudriverService,
    private orderService: OrderService, 
    private firebaseLocation: FirebaseLocationService,
    private alertCtrl: AlertController
    
  ) {}

  ngOnInit() {
    this.loadProfile(); // opsional di sini
    this.startPollingOrder();
    this.startRealtimeLocationUpdate(); 
  }

  ngOnDestroy() {
  this.stopPollingOrder();
  if (this.watchId) {
    Geolocation.clearWatch({ id: this.watchId });
    console.log('🛑 Watch position dihentikan');
  }
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
  

  

  async startRealtimeLocationUpdate() {
  const driverId = parseInt(localStorage.getItem('user_id') || '0');

  this.watchId = await Geolocation.watchPosition(
    { enableHighAccuracy: true },
    (position, err) => {
      if (err) {
        console.error('❌ Gagal ambil lokasi:', err);
        return;
      }

      if (!position) return;

      const lat = position.coords.latitude;
      const lng = position.coords.longitude;

      const distance = this.hitungJarak(this.lastLat, this.lastLng, lat, lng);
      if (distance < 0.03) return; // < 30 meter

      this.lastLat = lat;
      this.lastLng = lng;

      this.firebaseLocation.updateDriverLocation(driverId, lat, lng);
      this.menuDriverService.getCurrentLocation(lat, lng).subscribe({
        next: res => console.log('✅ Lokasi dikirim ke backend:', res),
        error: err => console.error('❌ Gagal kirim lokasi ke backend:', err)
      });
    }
  );
}


  hitungJarak(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371; // Radius bumi dalam km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c; // Jarak dalam kilometer
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

 

async getCurrentLocation(retry = 0) {
  this.loadingLokasi = true;
  this.lokasiBerhasil = false;

  try {
    const position = await Geolocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 10000, // 10 detik
      maximumAge: 0
    });

    this.latitude = position.coords.latitude;
    this.longitude = position.coords.longitude;
    this.lokasiBerhasil = true;
    this.loadingLokasi = false;

    console.log('✅ Lokasi berhasil:', this.latitude, this.longitude);

    this.menuDriverService.getCurrentLocation(this.latitude, this.longitude).subscribe({
      next: res => console.log('✅ Lokasi dikirim ke backend:', res),
      error: err => console.error('❌ Gagal kirim lokasi:', err)
    });

  } catch (error) {
    console.error(`❌ Lokasi gagal (percobaan ke-${retry + 1}):`, error);

    if (retry < 3) {
      setTimeout(() => this.getCurrentLocation(retry + 1), 2000);
    } else {
      this.loadingLokasi = false;
      // Jangan alert di sini. Biarkan UI yang kasih tombol "Coba Lagi"
    }
  }
}


  
  
  async tampilkanAlertOrder(order: any) {
    const alert = await this.alertCtrl.create({
      header: 'Order Masuk!',
      message: `
        <strong>Customer:</strong> ${order.nama}<br>
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
            this.firebaseLocation.updateStatus(this.orderId, 'dijemput');
            console.log('👤 Customer:', this.orderMasuk.customer);
          }
        }
      ]
    });
  
    await alert.present();
  }

  terimaOrder(orderId: number) {
    const driverId = parseInt(localStorage.getItem('user_id') || '0');
    const status = 'dijemput';
  
    this.menuDriverService.terimaOrder({
      order_id: orderId,
      driver_id: driverId
    }).subscribe({
      next: (res) => {
        console.log('✅ Order diterima:', res);
        this.firebaseLocation.updateStatus(orderId, status);
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
  const driverId = parseInt(localStorage.getItem('user_id') || '0');

  this.menuDriverService.tolakOrder({
    order_id: this.orderId,
    driver_id: driverId
  }).subscribe({
    next: async (res) => {
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
      console.error('❌ Gagal tolak order kandidat:', err);
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
      this.orderMasuk = res.order;
      this.firebaseLocation.updateStatus(this.orderId, 'dijemput');

      const toast = await this.toastController.create({
        message: 'Permintaan diterima.',
        duration: 2000,
        color: 'success',
      });
      toast.present();

      console.log('📍 LatLng:', this.orderMasuk.jemput_latitude, this.orderMasuk.jemput_longitude);
      console.log('👤 Customer:', this.orderMasuk.customer);


     this.router.navigate(['/jemputpenumpang'], {
      queryParams: {
        orderId: this.orderId,
        nama: this.orderMasuk?.customer?.nama || '-',
        pickupLat: this.orderMasuk.jemput_latitude,
        pickupLng: this.orderMasuk.jemput_longitude,
        pickupAddress: this.orderMasuk.lokasi_jemput,
        destinationAddress: this.orderMasuk.lokasi_tujuan,
        totalHarga: this.orderMasuk.tarif,
        customerPhoto: this.orderMasuk?.customer?.photo || '-',
        destinationLat: this.orderMasuk?.tujuan_latitude, 
        destinationLng: this.orderMasuk?.tujuan_longitude,


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
