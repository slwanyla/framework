import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || '';
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  // ✅ Buat order
  buatOrder(data: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/buat-order`, data, {
      headers: this.getHeaders()
    });
  }

  // ✅ Cek estimasi tarif & driver terdekat
  cekTarif(data: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/cek-tarif`, data, {
      headers: this.getHeaders()
    });
  }

  cekStatus(orderId: number): Observable<any> {
    return this.http.get(`${environment.apiUrl}/order-status/${orderId}`, {
      headers: this.getHeaders()
    });
  }  

  batalkanOrder(data: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/batalkan-order`, data, {
      headers: this.getHeaders()
    });
  } 

   getDriverByOrderId(orderId: number): Observable<any> {
    return this.http.get(`${environment.apiUrl}/order/${orderId}/driver`, {
    headers: this.getHeaders()
  });
  
}

   updatePerjalanan(orderId: number, status: string): Observable<any> {
    const body = {
    order_id: orderId,
    status: status
  };

  return this.http.post(`${environment.apiUrl}/perjalanan/update-status`, body, {
    headers: this.getHeaders()
  });
}

  

}
