// services/api.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  
  private baseUrl = 'http://127.0.0.1:8000/api'; // Sesuaikan dengan Laravel
  
  constructor(private http: HttpClient) { }
  
  getData() {
    return this.http.get(`${this.baseUrl}/test`);
  }
}