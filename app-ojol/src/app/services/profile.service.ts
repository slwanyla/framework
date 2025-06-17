import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  constructor(private http: HttpClient) {}

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

  
   // Update profil user
  updateProfile(profileData: any): Observable<any> {
    return this.http.put(`${environment.apiUrl}/update-profile`, profileData, {
      headers: this.getHeaders()
    });
  }

  
  // Upload foto profil
   
  uploadPhoto(photoFile: File): Observable<any> {
    const formData = new FormData();
    formData.append('photo', photoFile);
  
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
     
      
    });
  
    return this.http.post(`${environment.apiUrl}/profile-upload-photo`, formData, {
      headers
    });
  }
  
  }

  
