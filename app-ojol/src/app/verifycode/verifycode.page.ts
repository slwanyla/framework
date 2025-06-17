import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service'; 

@Component({
  selector: 'app-verifycode',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule,],
  templateUrl: './verifycode.page.html',
  styleUrls: ['./verifycode.page.scss'],
})
export class VerifycodePage implements OnInit {
  email: string = '';
  code1 = ''; code2 = ''; code3 = ''; code4 = '';

  constructor(private router: Router, private route: ActivatedRoute,  private authService: AuthService) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.email = params['email'] || 'Tidak diketahui';
    });
  }

  async verifycode() {
    if (!this.code1 || !this.code2 || !this.code3 || !this.code4) {
      alert('Semua digit kode OTP harus diisi!');
      return;
    }

    const code = this.code1 + this.code2 + this.code3 + this.code4;

   try {
    const res = await this.authService.verifyCode(this.email, code);
    alert(res.message);

    if (res.message === 'Verifikasi berhasil' || res.success) {
      this.router.navigate(['/home'], { queryParams: { reset: true } });
    }
    } catch (err) {
      alert('Kode OTP salah atau server error.');
      console.error(err);
    }
  }

  async resendOtp() {
    try {
      const res = await this.authService.resendVerificationCode(this.email);
      alert(res.message);
    } catch (err) {
      alert('Gagal mengirim ulang kode');
      console.error(err);
    }
  }
}

  
