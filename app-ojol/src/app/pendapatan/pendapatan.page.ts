import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { MenudriverService } from '../services/menudriver.service';

@Component({
  selector: 'app-pendapatan',
  standalone: true,
  imports: [IonicModule, CommonModule],
  templateUrl: './pendapatan.page.html',
  styleUrls: ['./pendapatan.page.scss'],
})
export class PendapatanPage implements OnInit {

  selectedFilter = 'Hari ini';
  isFilterOpen = false;
  filterOptions = ['Hari ini', 'Kemarin', 'Minggu ini', 'Semua'];
  totalPenghasilan: number = 0;

  allOrders: any[] = []; // ✅ Tambahkan ini
  filteredOrders: any[] = [];

  constructor(private router: Router, private menuDriverService: MenudriverService) {}

  ngOnInit() {
  const userId = localStorage.getItem('user_id');
  console.log('🔍 ID Driver yang dikirim:', userId);

  if (!userId) return;

  this.menuDriverService.pendapatan(userId).subscribe((data) => {
    const selesaiOnly = data.riwayat.filter((order: any) => order.status.toLowerCase() === 'selesai');
    console.log('🔥 Data dari API:', data);
    this.allOrders = selesaiOnly
    .filter((item: any) => !!item.tanggal)
    .map((item: any) => {
      const tgl = new Date(item.tanggal);
      console.log('📅 Tanggal Order:', item.tanggal, '| Parsed:', tgl.toDateString());
      return {
        ...item,
        jumlah: item.penghasilan_driver,
        tanggal: tgl
      };
    });


    this.filterOrders();
  });
}


  // Buka modal filter
  openFilter() {
    this.isFilterOpen = true;
  }

  closeFilter() {
    this.isFilterOpen = false;
  }

  selectFilter(filter: string) {
    this.selectedFilter = filter;
    this.filterOrders();
  }

  applyFilter() {
    this.filterOrders();
    this.closeFilter();
  }

  resetFilter() {
    this.selectedFilter = 'Hari ini';
    this.filterOrders();
    this.closeFilter();
  }

  // Logika filter dan hitung total penghasilan
  filterOrders() {
    const today = new Date();

    if (this.selectedFilter === 'Hari ini') {
      this.filteredOrders = this.allOrders.filter(order =>
        this.isSameDay(order.tanggal, today)
      );
    } else if (this.selectedFilter === 'Kemarin') {
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      this.filteredOrders = this.allOrders.filter(order =>
        this.isSameDay(order.tanggal, yesterday)
      );
    } else if (this.selectedFilter === 'Minggu ini') {
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - ((today.getDay() + 6) % 7)); // Mulai dari Senin

      this.filteredOrders = this.allOrders.filter(order =>
        order.tanggal >= startOfWeek
      );
    } else {
      this.filteredOrders = this.allOrders;
    }

    // ✅ Hitung total penghasilan
    this.totalPenghasilan = this.filteredOrders.reduce((acc, order) => acc + order.jumlah, 0);
  }

  isSameDay(date1: Date, date2: Date): boolean {
  return date1.toDateString() === date2.toDateString();
}


  // Navigasi tab
  goToHome() {
    this.router.navigate(['/menudriver']);
  }

  goToActivity() {
    this.router.navigate(['/aktivitasdriver']);
  }

  goToIncome() {
    this.router.navigate(['/pendapatandriver']);
  }

  goToSettings() {
    this.router.navigate(['/pengaturandriver']);
  }
}
