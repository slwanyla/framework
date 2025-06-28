import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { ProfileService } from 'src/app/services/profile.service';
import { BerandaService } from 'src/app/services/beranda.service';
import { Geolocation } from '@capacitor/geolocation';


@Component({
  selector: 'app-beranda',
  standalone: true,
  imports: [IonicModule, CommonModule],
  templateUrl: './beranda.page.html',
  styleUrls: ['./beranda.page.scss'],
})
export class BerandaPage implements OnInit {
  loggedInName: string = '';
  photoUrl: string | null = null;
  latitude: number | null = null;
  longitude: number | null = null;
  greeting = '';
  totalHarga: number = 0;


  constructor(private router: Router, private profileService: ProfileService, private berandaService: BerandaService) {}


  ngOnInit() {
    this.profileService.getProfile().subscribe({
      next: (res) => {
        this.loggedInName = res.nama ?? 'Pengguna';
        this.photoUrl = res.photo ?? null;
        console.log('✅ Photo URL yang diterima:', this.photoUrl)
        localStorage.setItem('loggedInName', this.loggedInName); 
      },
      error: (err) => {
        console.error('Gagal ambil profil:', err);
      }
      
    });
    this.getCurrentLocation();
    this.setGreeting();
  }

  async getCurrentLocation() {
    try {
      console.log('🔍 Mengambil lokasi via Capacitor...');
      const position = await Geolocation.getCurrentPosition();
      this.latitude = position.coords.latitude;
      this.longitude = position.coords.longitude;
      console.log('Lokasi saat ini:', this.latitude, this.longitude);
  
      // ✅ Kirim ke backend
      this.berandaService.getCurrentLocation(this.latitude, this.longitude).subscribe({
        next: (res) => {
          console.log('Lokasi berhasil dikirim:', res);
        },
        error: (err) => {
          console.error('Gagal kirim lokasi:', err);
        }
      });
  
    } catch (error) {
      console.error('Gagal ambil lokasi:', error);
      alert('Gagal mendapatkan lokasi. Pastikan izin lokasi aktif.');
    }
  }

  setGreeting() {
    const hour = new Date().getHours();

    if (hour >= 5 && hour < 12) {
      this.greeting = 'Selamat Pagi';
    } else if (hour >= 12 && hour < 15) {
      this.greeting = 'Selamat Siang';
    } else if (hour >= 15 && hour < 18) {
      this.greeting = 'Selamat Sore';
    } else {
      this.greeting = 'Selamat Malam';
    }
  }
  
  pesanOjol(jenis: string) {
    this.router.navigate(['/pesanojol'], {
      queryParams: { kendaraan: jenis }
    });
  }

  


  goToPage(url: string) {
    this.router.navigateByUrl(url);
  }
}
