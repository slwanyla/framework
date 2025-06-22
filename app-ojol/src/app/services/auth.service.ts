import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment'; 



// Define interfaces for better type safety
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
  constructor(private router: Router) {}

  // LOGIN
  async login(login: string, password: string) {
    const response = await fetch('http://127.0.0.1:8000/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ login, password })
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Login gagal');

    localStorage.setItem('token', data.token);
    localStorage.setItem('role', data.user.role);
    localStorage.setItem('user_id', data.user.id.toString());
    
    

    return data;
  }

  // REGISTER
  async register(
  username: string,
  nama:string,
  email: string,
  password: string,
  phone: string,
  role: string,
  tipeKendaraan?: string,
  merek?: string,
  warnaKendaraan?: string,
  noPlat?: string
) {
  const body: any = {
    username,
    nama,
    email,
    password,
    phone,
    role,
  };

  // Tambahkan data kendaraan jika role driver
  if (role === 'driver') {
    body.tipeKendaraan = tipeKendaraan;
    body.merek = merek;
    body.warnaKendaraan = warnaKendaraan;
    body.noPlat = noPlat;
  }

  const response = await fetch('http://127.0.0.1:8000/api/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  const data = await response.json();

    if (!response.ok) {
      // Biar error bisa ditangkap dengan detail di home.page.ts
      throw { status: response.status, error: data };
    }

    return data;

}

  // KIRIM ULANG OTP
  async resendVerificationCode(email: string): Promise<ApiResponse> {
    const response = await fetch('http://127.0.0.1:8000/api/resend-verification-code', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email })
    });

    const data = await response.json();
    return data;
  }

  // VERIFIKASI KODE OTP
  async verifyCode(email: string, code: string): Promise<VerifyResponse> {
    const response = await fetch('http://127.0.0.1:8000/api/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email,
        digit1: code[0],
        digit2: code[1],
        digit3: code[2],
        digit4: code[3]
      })
    });

    const data = await response.json();
    return data;
  }

  async saveFcmToken(userId: number, token: string, deviceType: string = 'android') {
    const response = await fetch('http://127.0.0.1:8000/api/save-fcm-token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id: userId,
        token: token,
        device_type: deviceType
      })
    });
  
    const data = await response.json();
    return data;
  }

  // LOGOUT
  async logout(): Promise<ApiResponse> {
    const token = localStorage.getItem('token');
    const response = await fetch('http://127.0.0.1:8000/api/logout', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();
    localStorage.removeItem('token');
    return data;
  }

  async forgotPassword(email: string) {
    const response = await fetch('http://127.0.0.1:8000/api/forgot-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email })
    });

    const data = await response.json();
    return data;
  }
  
  
}

