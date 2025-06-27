import { Injectable } from '@angular/core';
import { db } from '../firebase';
import { getDatabase, ref, set } from 'firebase/database';


@Injectable({
  providedIn: 'root'
})
export class FirebaseLocationService {

  constructor() { }

  updateDriverLocation(driverId: number, lat: number, lng: number): void {
    const lokasiRef = ref(db, `lokasi_driver/${driverId}`);
    set(lokasiRef, {
      lat,
      lng,
      updated_at: Date.now()
    });
  }

  updateStatus(orderId: number, status: string): void {
    const statusRef = ref(db, `orderTracking/${orderId}/status`);
    set(statusRef, status )
    .then(() => console.log('✅ Status dikirim'))
    .catch(err => console.error('❌ Gagal kirim status:', err));
  }
  
  
}
