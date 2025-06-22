import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-hubungiadmin',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  templateUrl: './hubungiadmin.page.html',
  styleUrls: ['./hubungiadmin.page.scss'],
})
export class HubungiadminPage {
  messages: { sender: 'user' | 'admin', text: string }[] = [
    { sender: 'admin', text: 'Halo, ada yang bisa kami bantu?' }
  ];
  newMessage: string = '';

  constructor(private router: Router) {}

  sendMessage() {
    if (!this.newMessage.trim()) return;

    this.messages.push({ sender: 'user', text: this.newMessage.trim() });

    setTimeout(() => {
      this.messages.push({ sender: 'admin', text: 'Terima kasih, pesan Anda sudah kami terima.' });
    }, 1000);

    this.newMessage = '';
  }
}
