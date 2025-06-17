import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ringkasanorder',
  standalone: true,
  imports: [IonicModule, CommonModule],
  templateUrl: './ringkasanorder.page.html',
  styleUrls: ['./ringkasanorder.page.scss'],
})
export class RingkasanorderPage implements OnInit {

  constructor(private router: Router) {}

  ngOnInit() {
  }

  goToHome() {
    this.router.navigateByUrl('/menudriver');
  }

  bukaChat() {
    this.router.navigate(['/chat'], { queryParams: { from: 'ringkasanorder' } });
  }

}
