import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs'; 

@Injectable({
  providedIn: 'root'
})
export class RouteService {

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

   getRoute(startLng: number, startLat: number, endLng: number, endLat: number): Observable<any> {
  const body = {
    coordinates: [
      [startLng, startLat],
      [endLng, endLat]
    ]
  };

  return this.http.post(`${environment.apiUrl}/proxy-ors`, body, {
    headers: this.getHeaders()
  });
}

}
