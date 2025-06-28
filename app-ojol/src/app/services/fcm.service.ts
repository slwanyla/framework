import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { FCM } from '@awesome-cordova-plugins/fcm/ngx';

@Injectable({
  providedIn: 'root'
})
export class FcmService {
  constructor(
    private http: HttpClient,
    private router: Router,
    private platform: Platform,
    private fcm: FCM
  ) {}

  initPush() {
    if (this.platform.is('cordova')) {
      this.fcm.onNotification().subscribe(async (data: any) => {
        console.log('📩 Notifikasi FCM diterima:', data);

        if (data.wasTapped) {
          // ✅ App dalam keadaan background
          this.handleNotification(data);
        } else {
          // ✅ App sedang terbuka (foreground)
          this.handleNotification(data);
        }
      });
    }
  }

  private handleNotification(data: any) {
    if (data?.type === 'order_baru' && data?.order_id) {
      console.log('🔔 Navigasi ke detail order ID:', data.order_id);
      this.router.navigate(['/menudriver ', data.order_id]);
    }
  }

  kirimTokenKeBackend(token: string, loginToken: string) {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${loginToken}`,
      'Content-Type': 'application/json'
    });

    const body = {
      token: token,
      device_type: 'android'
    };

    this.http.post(`${environment.apiUrl}/fcm-token`, body, { headers }).subscribe({
      next: res => console.log('✅ Token FCM disimpan ke backend'),
      error: err => console.error('❌ Error kirim token FCM:', err)
    });
  }
}
