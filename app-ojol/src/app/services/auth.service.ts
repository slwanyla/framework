import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

interface ApiResponse {
  success: boolean;
  message: string;
  data?: any;
}

interface RegisterResponse extends ApiResponse {
  user?: any;
  verification_code?: string;
}

interface VerifyResponse extends ApiResponse {
  user?: any;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClient, private router: Router) {}

  private getHeaders(includeToken: boolean = false): HttpHeaders {
    const headersConfig: any = {
      'Content-Type': 'application/json'
    };
    if (includeToken) {
      const token = localStorage.getItem('token');
      if (token) {
        headersConfig['Authorization'] = `Bearer ${token}`;
      }
    }
    return new HttpHeaders(headersConfig);
  }

  // ✅ LOGIN
  login(login: string, password: string): Observable<any> {
    return new Observable(observer => {
      this.http.post<any>(`${environment.apiUrl}/login`, { login, password }, {
        headers: this.getHeaders()
      }).subscribe({
        next: (data) => {
          localStorage.setItem('token', data.token);
          localStorage.setItem('role', data.user.role);
          localStorage.setItem('user_id', data.user.id.toString());
          observer.next(data);
          observer.complete();
        },
        error: (err) => observer.error(err)
      });
    });
  }

  // ✅ REGISTER
  register(userData: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/register`, userData);
}


  // ✅ KIRIM ULANG OTP
  resendVerificationCode(email: string): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${environment.apiUrl}/resend-verification-code`, { email }, {
      headers: this.getHeaders()
    });
  }

  // ✅ VERIFIKASI KODE OTP
  verifyCode(email: string, code: string): Observable<VerifyResponse> {
    return this.http.post<VerifyResponse>(`${environment.apiUrl}/verify`, {
      email,
      digit1: code[0],
      digit2: code[1],
      digit3: code[2],
      digit4: code[3]
    }, {
      headers: this.getHeaders()
    });
  }

  // ✅ SIMPAN FCM TOKEN
  saveFcmToken(userId: number, token: string, deviceType: string = 'android'): Observable<any> {
    return this.http.post(`${environment.apiUrl}/save-fcm-token`, {
      user_id: userId,
      token: token,
      device_type: deviceType
    }, {
      headers: this.getHeaders()
    });
  }

  // ✅ LOGOUT
  logout(): Observable<ApiResponse> {
    return new Observable(observer => {
      this.http.post<ApiResponse>(`${environment.apiUrl}/logout`, {}, {
        headers: this.getHeaders(true)
      }).subscribe({
        next: (res) => {
          localStorage.removeItem('token');
          localStorage.removeItem('user_id');
          localStorage.removeItem('role');
          observer.next(res);
          observer.complete();
        },
        error: (err) => observer.error(err)
      });
    });
  }

  // ✅ LUPA PASSWORD
  forgotPassword(email: string): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${environment.apiUrl}/forgot-password`, { email }, {
      headers: this.getHeaders()
    });
  }
}
