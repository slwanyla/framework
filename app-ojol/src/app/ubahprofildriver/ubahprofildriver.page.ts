import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule, AlertController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // penting untuk ngModel
import { ProfileService } from '../services/profile.service';

@Component({
  selector: 'app-ubahprofildriver',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  templateUrl: './ubahprofildriver.page.html',
  styleUrls: ['./ubahprofildriver.page.scss'],
})
export class UbahprofildriverPage implements OnInit {

  showModal = false;
  fotoProfil: string | null = null;
  selectedFile: File | null = null;

  form = {
    nama: '',
    email: '',
    plat: '',
    kendaraan: '',
    warna:'',
    merek:'',
    alamat: '',
    fotoProfil:''
  };

  constructor(
    private router: Router,
    private alertCtrl: AlertController,
    private profileService: ProfileService
  ) {}

  ngOnInit() {
    this.profileService.getProfile().subscribe({
      next: (res) => {
        this.form.nama = res.nama;
        this.form.email = res.email;
        this.fotoProfil = res.photo; // opsional
        this.form.plat = res.driver?.no_plat || '';
        this.form.merek = res.driver?.merek || '';
        this.form.kendaraan = res.driver?.tipe_kendaraan || '';
        this.form.warna = res.driver?.warna_kendaraan || ''; 
       
        // alamat = tidak disimpan sebelumnya
      },
      error: (err) => {
        console.error('❌ Gagal ambil data profil:', err);
      }
    });
    
  }

  bukaModal() {
    this.showModal = true;
  }

  tutupModal() {
    this.showModal = false;
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

  pilihFoto() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';

    input.onchange = () => {
      const file = input.files?.[0];
      if (file) {
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

  async simpanPerubahan() {
    const updateData: any = {
      nama: this.form.nama,
      email: this.form.email,
      photo: this.form.fotoProfil,
      warna_kendaraan: this.form.warna,
      tipe_kendaraan: this.form.kendaraan,
      no_plat: this.form.plat,
      merek: this.form.merek,
    };
  
    try {
      // Upload foto jika ada
      if (this.selectedFile) {
        const res = await this.profileService.uploadPhoto(this.selectedFile).toPromise();
        console.log('Upload success:', res);
      }
  
      // Update profil
      await this.profileService.updateProfile(updateData).toPromise();
  
      const alert = await this.alertCtrl.create({
        header: 'Berhasil',
        message: 'Perubahan profil berhasil disimpan.',
        buttons: ['OK'],
      });
      await alert.present();
      this.router.navigate(['/profildriver']);
  
    } catch (err) {
      console.error('❌ Gagal update profil:', err);
  
      const alert = await this.alertCtrl.create({
        header: 'Gagal',
        message: 'Terjadi kesalahan saat menyimpan perubahan.',
        buttons: ['OK'],
      });
      await alert.present();
    }
  }
  
  
  
}
