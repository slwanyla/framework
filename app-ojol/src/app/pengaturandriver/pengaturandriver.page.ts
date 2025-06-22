import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { LogoutService } from '../services/logout.service';

@Component({
  selector: 'app-pengaturandriver',
  standalone: true,
  imports: [IonicModule, CommonModule],
  templateUrl: './pengaturandriver.page.html',
  styleUrls: ['./pengaturandriver.page.scss'],
})
export class PengaturandriverPage implements OnInit {

  constructor(private router: Router, private logoutService: LogoutService) {}

  ngOnInit() {}

  goToHome() {
    this.router.navigate(['/menudriver']);
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

  goToEditProfile() {
  this.router.navigate(['/profildriver']);
  }

  goToPusatBantuan() {
  this.router.navigate(['/pusatbantuan']);
  }

  goToHubungiAdmin() {
  this.router.navigate(['/hubungiadmin']);
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



}
