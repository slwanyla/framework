import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { FirebaseX } from '@ionic-native/firebase-x/ngx';
import { Platform } from '@ionic/angular';




@Component({
  selector: 'app-home',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],

})
export class HomePage implements OnInit {
  email: string = '';  // Variabel email
  loginInput: string = '';  // Untuk input login (email, username, no.hp)
  password: string = '';  // Untuk input password
  
  // Variabel untuk form pendaftaran
  username: string = '';
  nama:string= '';
  phone: string = '';
  role: string = '';
  token:string='';

  loadingRegister = false;
  loadingLogin = false;
  loadingForgot = false;

  

  // Variabel khusus driver
  tipeKendaraan: string = '';
  warnaKendaraan: string = '';
  noPlat: string = '';
  merek: string= '';
  
  showForgotPasswordForm = false;
  forgotEmail: string = '';
  

  constructor(private router: Router, private authService: AuthService, private firebaseX: FirebaseX,  
    private platform: Platform) {}

  async ngOnInit() {
    this.router.routerState.root.queryParams.subscribe(params => {
      if (params['reset']) {
        this.resetRegisterForm();// ✅ panggil di sini
        this.resetLoginForm();
      }
      
    });

    this.firebaseX.getToken().then(token => {
      console.log('Token FCM:', token);
      // Bisa langsung kirim token ke server di sini
    }).catch(error => {
      console.error('Gagal ambil token FCM:', error);
    });

    this.firebaseX.onTokenRefresh().subscribe(newToken => {
      console.log('Token FCM diperbarui:', newToken);
      // Kirim ulang ke backend kalau perlu
    });
    
  }

  


  // Fungsi yang dipanggil ketika role berubah
  async onRoleChange() {
    console.log('Selected role:', this.role);
    // Untuk reset field driver jika user berubah dari driver ke pengguna
    if (this.role !== 'driver') {
      this.tipeKendaraan = '';
      this.merek = '';
      this.warnaKendaraan = '';
      this.noPlat = '';
      
    }
  }

  async signUp() {
      this.loadingRegister = true;
    // Validasi field umum
    if (!this.username || !this.nama || !this.email || !this.phone || !this.role || !this.password) {
      alert('Semua field wajib diisi!');
      this.loadingRegister = false; 
      return;
    }

    // Validasi khusus untuk driver
    if (this.role === 'driver') {
      if (!this.tipeKendaraan || !this.merek|| !this.warnaKendaraan || !this.noPlat) {
        alert('Informasi kendaraan harus diisi lengkap!');
        this.loadingRegister = false;
        return;
        
      }
    }

    // Data yang akan dikirim ke backend
    let userData = {
      username: this.username,
      nama: this.nama,
      email: this.email,
      phone: this.phone,
      role: this.role,
      password: this.password
    };

    // Tambahkan data driver jika role-nya driver
    if (this.role === 'driver') {
      Object.assign(userData, {
        tipeKendaraan: this.tipeKendaraan,
        merek: this.merek,
        warnaKendaraan: this.warnaKendaraan,
        noPlat: this.noPlat
      });
    }
    
    try {
    this.nama = this.nama.toUpperCase();
    this.tipeKendaraan = this.tipeKendaraan.toUpperCase();
    this.merek = this.merek.toUpperCase();
    this.noPlat = this.noPlat.toUpperCase();
    this.warnaKendaraan = this.warnaKendaraan.toUpperCase();


    
     const response = await this.authService.register(
        this.username,
        this.nama,
        this.email,
        this.password,
        this.phone,
        this.role,
        this.tipeKendaraan,
        this.merek,
        this.warnaKendaraan,
        this.noPlat
      );

    console.log('Data pendaftaran:', userData);
    

    // Arahkan ke verifycode dengan email sebagai parameter
    this.router.navigate(['/verifycode'], {
      queryParams: { email: this.email }
    });
    } catch (error:any) {
     
      console.log('Gagal Daftar:', error);

      if (error?.error?.message) {
      alert(error.error.message);  // ini munculin "Domain email tidak valid." ke user
      } else {
        alert('Terjadi kesalahan saat registrasi.');
      }
      
    }
    
    this.loadingRegister = false;

  }

  // Fungsi login yang memungkinkan login menggunakan username, email, atau no.hp
  async login() {
    this.loadingLogin = true;
  
    if (!this.loginInput || !this.password) {
      this.loadingLogin = false;
      alert('Isi semua data login');
      return;
    }
  
    try {
      const response = await this.authService.login(this.loginInput, this.password);
      console.log('Login sukses:', response);
  
      let token = '';

      if (this.platform.is('cordova')) {
        const fetchedToken = await this.firebaseX.getToken();
        if (fetchedToken) {
          token = fetchedToken;
          console.log('Token FCM:', token);
          await this.authService.saveFcmToken(response.user.id, token);
        } else {
          console.warn('⚠️ Token FCM null');
        }
      } else {
        console.log('ℹ️ Bukan di device, skip ambil token FCM');
      }

  
      // ✅ Arahkan sesuai role
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