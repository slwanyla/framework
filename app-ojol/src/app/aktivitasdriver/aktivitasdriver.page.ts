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
  jumlahOrderMasuk: number = 0;
  jumlahOrderSelesai: number = 0;


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
        const allOrders = res.riwayat || [];

        let filteredOrders = allOrders;

        const today = new Date();
        const yesterday = new Date();
        yesterday.setDate(today.getDate() - 1);

        if (this.selectedFilter === 'hariini') {
          filteredOrders = allOrders.filter((order: any) => {
            const tgl = new Date(order.tanggal);
            return tgl.getDate() === today.getDate() &&
                   tgl.getMonth() === today.getMonth() &&
                   tgl.getFullYear() === today.getFullYear();
          });
        } else if (this.selectedFilter === 'kemarin') {
          filteredOrders = allOrders.filter((order: any) => {
            const tgl = new Date(order.tanggal);
            return tgl.getDate() === yesterday.getDate() &&
                   tgl.getMonth() === yesterday.getMonth() &&
                   tgl.getFullYear() === yesterday.getFullYear();
          });
        } else if (this.selectedFilter === 'minggu') {
          const startOfWeek = new Date(today);
          startOfWeek.setDate(today.getDate() - today.getDay()); // mulai minggu (minggu = 0)

          filteredOrders = allOrders.filter((order: any) => {
            const tgl = new Date(order.tanggal);
            return tgl >= startOfWeek && tgl <= today;
          });
        }

        this.riwayatLayanan = filteredOrders;

        // Update ringkasan
        this.jumlahOrderMasuk = filteredOrders.length;
        this.jumlahOrderSelesai = filteredOrders.filter((o: any) => o.status.toLowerCase() === 'selesai').length;
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
