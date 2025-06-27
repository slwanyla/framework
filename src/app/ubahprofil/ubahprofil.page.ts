import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProfileService } from 'src/app/services/profile.service';

@Component({
  selector: 'app-ubahprofil',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  templateUrl: './ubahprofil.page.html',
  styleUrls: ['./ubahprofil.page.scss'],
})
export class UbahprofilPage implements OnInit {
  fotoProfil: string | null = null;
  nama: string = '';
  nomorHP: string = '';
  email: string = '';
  role: string = '';
  
  
  selectedFile: File | null = null;

  showModal: boolean = false; // kontrol modal custom

  constructor(private router: Router,  private profileService: ProfileService ) {}

  ngOnInit() {
    this.profileService.getProfile().subscribe({
      next: (res) => {
        this.nama = res.nama;
        this.email = res.email;
        this.nomorHP = res.phone;
        this.fotoProfil = res.photo ?? null; // 🟢 Ini penting buat preview foto
        this.role = res.role;
      },
      error: (err) => {
        console.error('Gagal ambil data profil:', err);
      }
    });
  }
  


  tutupModal(): void {
    this.showModal = false;
  }

  gantiFoto(): void {
    this.showModal = true;
  }
  
  async updateProfile() {
    const payload: any = {};
    if (this.nama) payload.name = this.nama;
    if (this.nomorHP) payload.phone = this.nomorHP;
    if (this.email) payload.email = this.email;
  
    if (Object.keys(payload).length === 0) {
      alert('Tidak ada data yang diubah.');
      return;
    }
  
    try {
      await this.profileService.updateProfile(payload).toPromise();
      alert('Profil berhasil diperbarui.');
      this.router.navigateByUrl('/profilku');
    } catch (error) {
      console.error('Gagal update profil:', error);
      alert('Gagal memperbarui profil.');
    }
  }

  async uploadFoto() {
    if (!this.selectedFile) {
      alert('Pilih foto terlebih dahulu.');
      return;
    }

   
    try {
      await this.profileService.uploadPhoto(this.selectedFile).toPromise();
      alert('Foto profil berhasil diunggah.');
    } catch (error) {
      console.error('Gagal upload foto:', error);
      alert('Gagal mengunggah foto.');
    }
  }
  
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
  
      const reader = new FileReader();
      reader.onload = () => {
        this.fotoProfil = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  async submitUpdate() {
    const data: any = {};
    if (this.nama) data.name = this.nama;
    if (this.nomorHP) data.phone = this.nomorHP;
    if (this.email) data.email = this.email;
  
    if (Object.keys(data).length === 0 && !this.selectedFile) {
      alert('Tidak ada perubahan untuk disimpan.');
      return;
    }
  
    try {
      if (Object.keys(data).length > 0) {
        await this.profileService.updateProfile(data).toPromise();
      }
  
      if (this.selectedFile) {
        await this.profileService.uploadPhoto(this.selectedFile).toPromise();
      }
  
      alert('Profil berhasil diperbarui!');
      this.router.navigateByUrl('/profilku');
    } catch (err) {
      console.error('Gagal update profil:', err);
      alert('Terjadi kesalahan saat memperbarui profil.');
      
    }
  }
  
  pilihFoto(): void {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
  
    input.onchange = () => {
      const file = input.files?.[0];
      if (file) {
        if (file.size > 2 * 1024 * 1024) {
          alert('Ukuran file maksimal 2MB');
          return;
        }
  
        if (!['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)) {
          alert('Format file harus JPG, JPEG, atau PNG');
          return;
        }
  
        this.selectedFile = file;
  
        const reader = new FileReader();
        reader.onload = () => {
          this.fotoProfil = reader.result as string;
          this.tutupModal();
        };
        reader.readAsDataURL(file);
      }
    };
  
    input.click();
  }
  
}  