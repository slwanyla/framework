import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment'; 
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BerandaService {

  constructor(private http: HttpClient) { }


  getCurrentLocation(lat: number, lng: number): Observable<any> {
      const token = localStorage.getItem('token');
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      });
  
      return this.http.post(`${environment.apiUrl}/beranda`, {
        latitude: lat,
        longitude: lng
      }, { headers });
    }
}
