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
  riwayat(userId: string, role: 'customer' | 'driver'): Observable<any> {
  const endpoint = role === 'driver'
    ? `${environment.apiUrl}/riwayat-driver/${userId}`
    : `${environment.apiUrl}/riwayat-customer/${userId}`;

  return this.http.get(endpoint, {
    headers: this.getHeaders()
  });
}

}
