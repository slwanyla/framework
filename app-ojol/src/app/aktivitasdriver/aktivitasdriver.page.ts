import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-aktivitasdriver',
  standalone: true,
  imports: [IonicModule, CommonModule],
  templateUrl: './aktivitasdriver.page.html',
  styleUrls: ['./aktivitasdriver.page.scss'],
})
export class AktivitasdriverPage implements OnInit {

  selectedFilter: string = 'hariini';

  constructor(private router: Router) {}

  ngOnInit() {}

  changeFilter(filter: string) {
    this.selectedFilter = filter;
  }

  goToHome() {
    this.router.navigate(['/menudriver']);
  }

  goToIncome() {
    this.router.navigate(['/pendapatan']);
  }

  goToSettings() {
    this.router.navigate(['/pengaturandriver']);
  }

  downloadRiwayat() {
  console.log('Download diklik!');
  // Nanti bisa ditambahkan logika download CSV atau PDF di sini
  alert('Fitur download belum tersedia. Akan segera ditambahkan.');
  }

}
