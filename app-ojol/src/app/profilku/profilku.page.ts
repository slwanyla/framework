import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ProfileService } from 'src/app/services/profile.service';
import { LogoutService } from 'src/app/services/logout.service';

@Component({
  selector: 'app-profilku',
  standalone: true,
  imports: [IonicModule, CommonModule],
  templateUrl: './profilku.page.html',
  styleUrls: ['./profilku.page.scss'],
})
export class ProfilkuPage implements OnInit {
  user = {
    name:  '',
    email: '',
    phone: '',
    photoUrl: '' 
  };

  constructor(private router: Router, private http: HttpClient, private profileService: ProfileService,  private logoutService: LogoutService) {}

  ngOnInit() {
    this.profileService.getProfile().subscribe({
      next: (data) => {
        this.user.name = data.nama;  // atau data.name tergantung field di Laravel
        this.user.email = data.email;
        this.user.phone = data.phone;
        this.user.photoUrl = data.photo ?? ''; // optional

        console.log('Photo URL:', data.photo_url);

      },
      error: (err) => {
        
        console.error('Gagal mengambil data profil:', err);
      }
    });
  }

  

  goToUbahProfil() {
    this.router.navigateByUrl('/ubahprofil');
  }

  goToAktivitas() {
  this.router.navigateByUrl('/aktivitas');
  }

  goToNotifikasi() {
  this.router.navigateByUrl('/notifikasi');
  }

  logout() {
    this.logoutService.logout().subscribe({
      next: () => {

        console.log('%c Logout berhasil', 'color: green; font-weight: bold');

        localStorage.removeItem('token');
        localStorage.removeItem('loggedInName');
        this.router.navigate(['/home'], { queryParams: { reset: true }, replaceUrl: true });
        
      },
      error: (err) => {
        console.error('Logout gagal:', err);
      }
    });
  }
  

  goToPusatBantuan() {
  this.router.navigate(['/pusatbantuan']);
  }
}
