import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HistoryService {

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || '';
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  // ✅ Ambil aktivitas riwayat order
  getAktivitasPengguna(userId: string): Observable<any> {
    return this.http.get(`${environment.apiUrl}/riwayat-order?user_id=${userId}`, {
      headers: this.getHeaders()
    });
  }
}
