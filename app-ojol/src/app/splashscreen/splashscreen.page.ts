import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-splashscreen',
  standalone: true,
  imports: [IonicModule, CommonModule],
  templateUrl: './splashscreen.page.html',
  styleUrls: ['./splashscreen.page.scss'],
})
export class SplashscreenPage implements OnInit {

  constructor(private router: Router) {}
  ngOnInit() {
    setTimeout(() => {
      this.router.navigateByUrl('/home', { replaceUrl: true });
    }, 4000); // 3 detik
    setTimeout(() => {
      const splash = document.querySelector('.splash-container');
      splash?.classList.add('slide-up');
    }, 2000);
  }
  
}

