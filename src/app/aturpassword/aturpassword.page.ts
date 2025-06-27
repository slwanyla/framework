import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { IonicModule, ToastController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-aturpassword',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, HttpClientModule],
  templateUrl: './aturpassword.page.html',
  styleUrls: ['./aturpassword.page.scss'],
})
export class AturPasswordPage implements OnInit {
  passwordBaru: string = '';
  confirmPassword: string = '';
  token: string | null = null;
  email: string | null = null;

  showPassword: boolean = false;
  showPassword2: boolean = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private toastController: ToastController,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.token = params['token'];
      this.email = params['email'];
    });
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  togglePasswordVisibility2() {
    this.showPassword2 = !this.showPassword2;
  }

  async simpanPassword() {
    if (!this.passwordBaru || !this.confirmPassword) {
      this.tampilkanToast('Harap isi semua field');
      return;
    }

    if (this.passwordBaru.length < 6) {
      this.tampilkanToast('Password minimal 6 karakter');
      return;
    }


    if (this.passwordBaru !== this.confirmPassword) {
      this.tampilkanToast('Password tidak cocok!');
      return;
    }

    if (!this.token || !this.email) {
      this.tampilkanToast('Token atau email tidak valid!');
      return;
    }

    this.http.post('http://127.0.0.1:8000/api/reset-password', {
      token: this.token,
      email: this.email,
      password: this.passwordBaru,
      password_confirmation: this.confirmPassword
    }).subscribe({
      next: () => {
        this.tampilkanToast('Password berhasil diatur');
        setTimeout(() => {
          this.router.navigate(['/home']); 
        }, 1500);
      },
      error: (err) => {
      if (err.status === 400) {
        // Token expired / tidak valid
        const toast = this.toastController.create({
          message: 'Token sudah tidak berlaku. Kirim ulang link?',
          duration: 5000,
          position: 'top',
          buttons: [
            {
              text: 'Kirim Ulang',
              handler: () => {
              this.http.post('http://127.0.0.1:8000/api/resend-reset-link', {
                email: this.email
              }).subscribe({
                next: () => {
                  this.tampilkanToast('Link reset password telah dikirim ulang ke email kamu.');
                },
                error: () => {
                  this.tampilkanToast('Gagal mengirim ulang link.');
                }
              });
            }

            }
          ]
        });

        toast.then(t => t.present());
      } else {
        this.tampilkanToast('Gagal menyimpan password.');
      }
    }

    });
  }

  async tampilkanToast(pesan: string) {
    const toast = await this.toastController.create({
      message: pesan,
      duration: 2000,
      position: 'top',
      color: 'primary',
    });
    toast.present();
  }
}
