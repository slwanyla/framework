import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { OrderService } from '../services/order.service';
import { ChangeDetectorRef } from '@angular/core';


@Component({
  selector: 'app-ringkasanorder',
  standalone: true,
  imports: [IonicModule, CommonModule],
  templateUrl: './ringkasanorder.page.html',
  styleUrls: ['./ringkasanorder.page.scss'],
})
export class RingkasanorderPage implements OnInit {

  orderId: number = 0;
  detailOrder: any;
  qrisUrl: string = '';
  loadingQris: boolean = true;

  constructor(
    private router: Router,
     private route: ActivatedRoute, 
     private orderService: OrderService,
     private cdr: ChangeDetectorRef

  ) {}

  ngOnInit() {
  this.route.queryParams.subscribe(params => {
    this.orderId = +params['orderId'];
    if (this.orderId) {
      this.ambilDetailOrder();
    }
  });
}


 ambilDetailOrder() {
  this.orderService.getDetailOrder(this.orderId).subscribe({
    next: (res) => {
      this.detailOrder = res.data;

      // Pastikan ada orderId dan detailnya valid baru panggil QRIS
      if (this.detailOrder && this.orderId) {
        this.ambilQRIS();
      }
    },
    error: (err) => console.error('❌ Gagal ambil detail order:', err)
  });
}


  ambilQRIS() {
  this.loadingQris = true;
  this.orderService.getQrisUrl(this.orderId).subscribe({
    next: res => {
      console.log('✅ QRIS URL diterima:', res.qris_url);
      this.qrisUrl = res.qris_url;
      this.loadingQris = false;
      this.cdr.detectChanges(); // ⬅️ Paksa Angular ngecek ulang view
    },
    error: err => {
      console.error('❌ Gagal ambil QRIS:', err);
      this.loadingQris = false;
    }
  });
}



  goToHome() {
    this.router.navigateByUrl('/menudriver');
  }

  bukaChat() {
    this.router.navigate(['/chat'], { queryParams: { from: 'ringkasanorder' } });
  }

}
