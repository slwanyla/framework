import { Injectable } from '@angular/core';
import { db } from '../firebase';
import { ref, onValue } from 'firebase/database';

@Injectable({
  providedIn: 'root'
})
export class FirebaselistenerService {
  constructor() {}

  listenToOrderTracking(orderId: number, onUpdate: (lat: number, lng: number) => void): void {
    const lokasiRef = ref(db, `orderTracking/${orderId}/driverLocation`);
    onValue(lokasiRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        onUpdate(data.latitude, data.longitude);
      }
    });
  }
}
