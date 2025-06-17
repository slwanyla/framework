import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { IonicModule, ToastController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';  // <--- tambah import Router

@Component({
  selector: 'app-rating',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, HttpClientModule],
  templateUrl: './rating.page.html',
  styleUrls: ['./rating.page.scss'],
})
export class RatingPage implements OnInit {
  driverId: string = '';
  namaDriver: string = '';
  kendaraan: string = '';
  fotoDriver: string | null = null;
  rating: number = 0;
  ulasan: string = '';

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private toastController: ToastController,
    private router: Router  // <--- tambah injection Router
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.driverId = params['driverId'] || '';
      this.namaDriver = params['nama'] || 'Nama Driver';
      this.kendaraan = params['kendaraan'] || 'Info Kendaraan';
      this.fotoDriver = params['foto'] || null;
    });
  }

  setRating(value: number) {
    this.rating = value;
  }

  async kirimRating() {
    if (!this.rating || !this.ulasan || !this.driverId) {
      this.showToast('Harap lengkapi rating, ulasan, dan ID driver.', 'danger');
      return;
    }

    const data = {
      driverId: this.driverId,
      rating: this.rating,
      ulasan: this.ulasan
    };

    try {
      await this.http.post('https://example.com/api/driver-rating', data).toPromise();
      this.showToast('Rating berhasil dikirim!', 'success');

      // navigasi ke halaman beranda setelah toast selesai (2 detik)
      setTimeout(() => {
        this.router.navigate(['/beranda']); 
      }, 2000);

    } catch (error) {
      console.error('Gagal mengirim rating:', error);
      this.showToast('Gagal mengirim rating. Coba lagi nanti.', 'danger');
    }
  }

  async showToast(message: string, color: string = 'primary') {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      color,
    });
    await toast.present();
  }
}
