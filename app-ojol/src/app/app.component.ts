import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { FCM } from '@awesome-cordova-plugins/fcm/ngx';
import { FcmService } from './services/fcm.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private fcm: FCM,
    private fcmService: FcmService
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.setupFCM();         // kirim token ke backend
      this.fcmService.initPush(); // dengerin notifikasi
    });
  }

  async setupFCM() {
    const tokenLogin = localStorage.getItem('token');
    if (!tokenLogin) {
      console.log('🚫 Belum login, token login tidak ditemukan');
      return;
    }

    try {
      const fcmToken = await this.fcm.getToken();
      console.log('✅ Token FCM:', fcmToken);

      const lastToken = localStorage.getItem('last_fcm_token');
      if (lastToken !== fcmToken) {
        this.fcmService.kirimTokenKeBackend(fcmToken, tokenLogin);
        localStorage.setItem('last_fcm_token', fcmToken);
      }

      this.fcm.onTokenRefresh().subscribe(newToken => {
        console.log('🔁 Token FCM baru:', newToken);
        this.fcmService.kirimTokenKeBackend(newToken, tokenLogin);
        localStorage.setItem('last_fcm_token', newToken);
      });

    } catch (err) {
      console.error('❌ Gagal ambil token FCM:', err);
    }
  }
}
