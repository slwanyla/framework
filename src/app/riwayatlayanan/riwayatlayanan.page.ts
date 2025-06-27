import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { HistoryService } from '../services/history.service';

@Component({
  selector: 'app-riwayatlayanan',
  standalone: true,
  imports: [IonicModule, CommonModule],
  templateUrl: './riwayatlayanan.page.html',
  styleUrls: ['./riwayatlayanan.page.scss'],
})
export class RiwayatlayananPage implements OnInit {
  layanan: any[] = [];

  constructor(
    private router: Router,
    private historyService: HistoryService
  ) {}

  ngOnInit(): void {
    const role = localStorage.getItem('role') as 'driver' | 'customer';
    const userId = localStorage.getItem('user_id');

    if (!userId || !role) {
      console.error('User ID atau role tidak ditemukan di localStorage');
      return;
    }

    this.historyService.riwayat(userId, role).subscribe({
      next: (res: any) => {
        this.layanan = res.riwayat || [];
      },
      error: (err: any) => {
        console.error('Gagal ambil riwayat:', err);
      }
    });
  }
}
