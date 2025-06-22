import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MenudriverService {

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  getProfile(): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    return this.http.get(`${environment.apiUrl}/profile`, { headers });
  }

  getCurrentLocation(lat: number, lng: number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    return this.http.post(`${environment.apiUrl}/driver/update-location`, {
      latitude: lat,
      longitude: lng
    }, { headers });
  }

  updateStatus(aktif: boolean) {
    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    return this.http.post(`${environment.apiUrl}/driver/update-status`, { status: aktif }, { headers });
  }

  getOrderTerbaru(driverId: string) {
    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  
    return this.http.get<any>(`${environment.apiUrl}/order-driver-terbaru?driver_id=${driverId}`, { headers });
  }  

  terimaOrder(data: { order_id: number, driver_id: number }): Observable<any> {
    return this.http.post(`${environment.apiUrl}/order/terima`, data, {
      headers: this.getHeaders()
    });
  }

  tolakOrder(data: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/tolak-order`, data, {
      headers: this.getHeaders()
    });
  } 
  

}
