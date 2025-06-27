import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HistoryService } from '../services/history.service';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-aktivitas',
  standalone: true,
  imports: [IonicModule, CommonModule, HttpClientModule],
  templateUrl: './aktivitas.page.html',
  styleUrls: ['./aktivitas.page.scss'],
})
export class AktivitasPage implements OnInit {

  aktivitas: any[] = [];           // data asli dari API
  filteredAktivitas: any[] = [];   // data yang ditampilkan (setelah filter)
  selectedStatus: string = '';     // untuk menyimpan status yang dipilih
  selectedKendaraan: string = '';  // untuk menyimpan jenis kendaraan (motor/mobil)
  showModal = false;

  constructor(
    private router: Router,
    private http: HttpClient,
    private historyService: HistoryService
  ) {}

  ngOnInit() {
    this.ambilAktivitasPengguna();
  }

  ambilAktivitasPengguna() {
  const userId = localStorage.getItem('user_id');
  const role = localStorage.getItem('role') as 'customer' | 'driver'; // role dari backend

  if (!userId || !role) return;

  this.historyService.riwayat(userId, role).subscribe({
    next: (res) => {
      this.aktivitas = res.riwayat;
      this.filteredAktivitas = res.riwayat;
    },
    error: (err) => {
      console.error('❌ Gagal ambil riwayat:', err);
    }
  });
}



  openModal() {
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  selectStatus(status: string) {
    this.selectedStatus = status;
  }

  // Fungsi untuk memilih kendaraan motor/mobil
  selectKendaraan(kendaraan: string) {
    this.selectedKendaraan = kendaraan;
    this.filterAktivitas();
  }

  // Reset filter status dan kendaraan, kembalikan data semua
  resetFilter() {
    this.selectedStatus = '';
    this.selectedKendaraan = '';
    this.filteredAktivitas = [...this.aktivitas];
    this.closeModal();
  }

  // Terapkan filter berdasarkan status dan kendaraan
  applyFilter() {
    this.filterAktivitas();
    this.closeModal();
  }

  // Fungsi gabungan untuk filter aktivitas berdasarkan status dan kendaraan
  filterAktivitas() {
    this.filteredAktivitas = this.aktivitas.filter(item => {
      const statusMatch = this.selectedStatus ? item.status === this.selectedStatus : true;
      const kendaraanMatch = this.selectedKendaraan ? item.kendaraan === this.selectedKendaraan : true;
      return statusMatch && kendaraanMatch;
    });
  }

  goToPage(url: string) {
    this.router.navigateByUrl(url);
  }

  // ✅ Fungsi Download Struk PDF
  downloadStrukPDF() {
    const element = document.getElementById('struk-pdf');
    if (!element) return;

    element.style.display = 'block'; // tampilkan kontainer struk sebelum dicetak

    html2canvas(element).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('riwayat_pemesanan.pdf');

      element.style.display = 'none'; // sembunyikan kembali setelah diunduh
    });
  }
}
