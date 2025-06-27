import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

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

  // Data dummy order
  allOrders = [
    {
      nama: 'Rifha Reinda Warich',
      waktu: '09.00',
      jemput: 'Perum Karaba Indah Blok R.48',
      tujuan: 'Universitas Buana Perjuangan',
      status: 'Selesai',
      jumlah: 24000,
      tanggal: new Date()
    },
    {
      nama: 'Dina Ayu',
      waktu: '10.00',
      jemput: 'Cikampek',
      tujuan: 'Stasiun Karawang',
      status: 'Selesai',
      jumlah: 15000,
      tanggal: new Date(new Date().setDate(new Date().getDate() - 1))
    },
    {
      nama: 'Yusuf Ahmad',
      waktu: '14.00',
      jemput: 'Tanjungpura',
      tujuan: 'BTC',
      status: 'Selesai',
      jumlah: 17000,
      tanggal: new Date(new Date().setDate(new Date().getDate() - 4))
    }
  ];

  filteredOrders = this.allOrders;

  constructor(private router: Router) {}

  ngOnInit() {
    this.filterOrders();
  }

  // Format tanggal ke DD/MM/YYYY
  formatTanggal(date: Date): string {
    const dd = date.getDate().toString().padStart(2, '0');
    const mm = (date.getMonth() + 1).toString().padStart(2, '0');
    const yyyy = date.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
  }

  // Buka modal filter
  openFilter() {
    this.isFilterOpen = true;
  }

  // Tutup modal filter
  closeFilter() {
    this.isFilterOpen = false;
  }

  // Pilih filter
  selectFilter(filter: string) {
    this.selectedFilter = filter;
  }

  // Terapkan filter
  applyFilter() {
    this.filterOrders();
    this.closeFilter();
  }

  // Reset filter ke default
  resetFilter() {
    this.selectedFilter = 'Hari ini';
    this.filterOrders();
    this.closeFilter();
  }

  // Logika filter data
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
      startOfWeek.setDate(today.getDate() - today.getDay());
      this.filteredOrders = this.allOrders.filter(order =>
        order.tanggal >= startOfWeek
      );
    } else {
      this.filteredOrders = this.allOrders; // Semua
    }
  }

  // Membandingkan tanggal
  isSameDay(date1: Date, date2: Date): boolean {
    return date1.getDate() === date2.getDate() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getFullYear() === date2.getFullYear();
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
