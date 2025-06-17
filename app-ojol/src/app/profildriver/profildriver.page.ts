import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { ProfileService } from '../services/profile.service';

@Component({
  selector: 'app-profildriver',
  standalone: true,
  imports: [IonicModule, CommonModule],
  templateUrl: './profildriver.page.html',
  styleUrls: ['./profildriver.page.scss'],
})
export class ProfildriverPage implements OnInit {

  profile: any = {};
  photoUrl: string | null = null;
  constructor(private router: Router, private profileService: ProfileService) {}

  
  ngOnInit() {
    this.loadProfile(); // opsional di sini
  }
  
  loadProfile() {
    this.profileService.getProfile().subscribe({
      next: (res) => {
        this.profile = res;
        this.photoUrl = res.photo || null;
      },
      error: (err) => {
        console.error('❌ Gagal ambil profil:', err);
      }
    });
  }
  
  ionViewWillEnter() {
    this.loadProfile();
  }
  

  goBack() {
    this.router.navigate(['/pengaturandriver']);
  }

  goToEditProfile() {
    this.router.navigate(['/ubahprofildriver']);
  }

}
