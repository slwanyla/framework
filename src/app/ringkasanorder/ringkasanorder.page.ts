import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { OrderService } from '../services/order.service';

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

  constructor(
    private router: Router,
     private route: ActivatedRoute, 
     private orderService: OrderService

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
        
        // sekarang tinggal binding ke template
      },
      error: (err) => console.error('❌ Gagal ambil detail order:', err)
    });
  }

  goToHome() {
    this.router.navigateByUrl('/menudriver');
  }

  bukaChat() {
    this.router.navigate(['/chat'], { queryParams: { from: 'ringkasanorder' } });
  }

}
