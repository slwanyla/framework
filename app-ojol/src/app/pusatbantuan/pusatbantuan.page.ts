import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pusatbantua',
  standalone: true,
  imports: [IonicModule, CommonModule],
  templateUrl: './pusatbantuan.page.html',
  styleUrls: ['./pusatbantuan.page.scss'],
})
export class PusatbantuanPage implements OnInit {

  constructor(private router: Router) {}

  ngOnInit() {
  }

    goToTutorial() {
    this.router.navigate(['/tutorial']);
  }

}
