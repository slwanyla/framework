import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { HistoryService } from '../services/history.service';

@Component({
  selector: 'app-aktivitasdriver',
  standalone: true,
  imports: [IonicModule, CommonModule],
  templateUrl: './aktivitasdriver.page.html',
  styleUrls: ['./aktivitasdriver.page.scss'],
})
export class AktivitasdriverPage implements OnInit {

  selectedFilter: string = 'hariini';
  riwayatLayanan: any[] = [];

  constructor(
    private router: Router,
    private historyService: HistoryService
  ) {}

  ngOnInit() {
    this.getRiwayat();
  const userId = localStorage.getItem('user_id');
  const role = 'driver';
  const filter = this.selectedFilter;

  if (userId) {
    this.historyService.riwayat(userId, role, filter).subscribe({
      next: (res) => {
        this.riwayatLayanan = res.riwayat || [];
      },
      error: (err) => {
        console.error('Gagal ambil data:', err);
      }
    });
  }
}


  changeFilter(filter: string) {
  this.selectedFilter = filter;
  this.getRiwayat(); // method yang isinya ambil ulang dari API
}

getRiwayat() {
  const userId = localStorage.getItem('user_id');
  if (userId) {
    this.historyService.riwayat(userId, 'driver', this.selectedFilter).subscribe({
      next: (res) => {
        this.riwayatLayanan = res.riwayat || [];
      },
      error: (err) => {
        console.error('Gagal ambil data:', err);
      }
    });
  }
}



  goToHome() {
    this.router.navigate(['/menudriver']);
  }

  goToIncome() {
    this.router.navigate(['/pendapatan']);
  }

  goToSettings() {
    this.router.navigate(['/pengaturandriver']);
  }

  downloadRiwayat() {
    alert('Fitur download belum tersedia. Akan segera ditambahkan.');
  }
}
