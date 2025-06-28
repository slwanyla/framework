import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { FCM } from '@awesome-cordova-plugins/fcm/ngx';
import { Platform } from '@ionic/angular';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  email: string = '';
  loginInput: string = '';
  password: string = '';

  username: string = '';
  nama: string = '';
  phone: string = '';
  role: string = '';
  token: string = '';

  loadingRegister = false;
  loadingLogin = false;
  loadingForgot = false;

  tipeKendaraan: string = '';
  warnaKendaraan: string = '';
  noPlat: string = '';
  merek: string = '';

  showForgotPasswordForm = false;
  forgotEmail: string = '';

  constructor(
    private router: Router,
    private authService: AuthService,
    private platform: Platform,
    private fcm: FCM
  ) {}

  ngOnInit() {
    this.router.routerState.root.queryParams.subscribe((params) => {
      if (params['reset']) {
        this.resetRegisterForm();
        this.resetLoginForm();
      }
    });
  }

  async onRoleChange() {
    if (this.role !== 'driver') {
      this.tipeKendaraan = '';
      this.merek = '';
      this.warnaKendaraan = '';
      this.noPlat = '';
    }
  }

  async signUp() {
    this.loadingRegister = true;

    if (!this.username || !this.nama || !this.email || !this.phone || !this.role || !this.password) {
      alert('Semua field wajib diisi!');
      this.loadingRegister = false;
      return;
    }

    if (this.role === 'driver') {
      if (!this.tipeKendaraan || !this.merek || !this.warnaKendaraan || !this.noPlat) {
        alert('Informasi kendaraan harus diisi lengkap!');
        this.loadingRegister = false;
        return;
      }
    }

    this.nama = this.nama.toUpperCase();
    this.tipeKendaraan = this.tipeKendaraan.toUpperCase();
    this.merek = this.merek.toUpperCase();
    this.noPlat = this.noPlat.toUpperCase();
    this.warnaKendaraan = this.warnaKendaraan.toUpperCase();

    const userData: any = {
      username: this.username,
      nama: this.nama,
      email: this.email,
      phone: this.phone,
      role: this.role,
      password: this.password,
    };

    if (this.role === 'driver') {
      Object.assign(userData, {
        tipeKendaraan: this.tipeKendaraan,
        merek: this.merek,
        warnaKendaraan: this.warnaKendaraan,
        noPlat: this.noPlat,
      });
    }

    try {
      const response = await firstValueFrom(this.authService.register(userData));

      console.log('Data pendaftaran:', userData);

      this.router.navigate(['/verifycode'], {
        queryParams: { email: this.email },
      });
    } catch (error: any) {
      console.log('Gagal Daftar:', error);
      alert(error?.error?.message || 'Terjadi kesalahan saat registrasi.');
    } finally {
      this.loadingRegister = false;
    }
  }

  async login() {
    this.loadingLogin = true;

    if (!this.loginInput || !this.password) {
      alert('Isi semua data login');
      this.loadingLogin = false;
      return;
    }

    try {
      const response = await firstValueFrom(
        this.authService.login(this.loginInput, this.password)
      );

      console.log('Login sukses:', response);

      if (this.platform.is('cordova')) {
        const fcmToken = await this.fcm.getToken();
        if (fcmToken) {
          await firstValueFrom(this.authService.saveFcmToken(response.user.id, fcmToken));
          console.log('✅ FCM token berhasil dikirim ke backend');
        } else {
          console.warn('⚠️ Token FCM null');
        }
      } else {
        console.log('ℹ️ Bukan di device, skip ambil token FCM');
      }

      const role = response.user.role;
      if (role === 'driver') {
        this.router.navigate(['/menudriver']);
      } else {
        this.router.navigate(['/beranda']);
      }
    } catch (error: any) {
      alert(error.message || 'Login gagal');
      console.error('❌ Login gagal:', error);
    } finally {
      this.loadingLogin = false;
    }
  }

  // Fungsi untuk memeriksa apakah input adalah email
  private isEmail(input: string): boolean {
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return emailPattern.test(input);
  }

  // Fungsi untuk memeriksa apakah input adalah nomor telepon
  private isPhoneNumber(input: string): boolean {
    const phonePattern = /^[0-9]{10,12}$/; // Nomor telepon Indonesia (misal 10-12 digit)
    return phonePattern.test(input);
  }

  // Tambahkan di class HomePage:
isPasswordVisible: boolean = false;

togglePasswordVisibility() {
  this.isPasswordVisible = !this.isPasswordVisible;
}

// pas balik ke home, gada bekas ngisi form sebelumnya
  resetRegisterForm() {
    this.email = '';
    this.nama = '';
    this.username = '';
    this.phone = '';
    this.role = '';
    this.password = '';
  }

  resetLoginForm() {
      this.loginInput = '';
      this.password = ''; 
    
    
  }

  toggleForgotPassword() {
  this.showForgotPasswordForm = !this.showForgotPasswordForm;
}

async sendForgotPasswordEmail() {
  if (!this.forgotEmail) {
    alert('Masukkan email Anda.');
    return;
  }

  try {
    await this.authService.forgotPassword(this.forgotEmail);
    alert('Link reset password telah dikirim ke email Anda');
    this.showForgotPasswordForm = false;
    this.forgotEmail = '';
  } catch (error) {
    alert('Gagal mengirim email reset password');
    console.error(error);
  }
}



}