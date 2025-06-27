import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {
  chatMessages: { sender: 'user' | 'driver'; text: string; timestamp: string }[] = [];
  messageInput: string = '';
  currentSender: 'user' | 'driver' = 'user'; // Default pengguna

  constructor(private router: Router) {}

  ngOnInit() {
  }

  kirimPesan() {
    if (!this.messageInput.trim()) return;

    const newMessage = {
      sender: this.currentSender,
      text: this.messageInput.trim(),
      timestamp: new Date().toISOString()
    };

    this.chatMessages.push(newMessage);

    // Ganti pengirim untuk simulasi bolak-balik
    this.currentSender = this.currentSender === 'user' ? 'driver' : 'user';

    // Kosongkan input
    this.messageInput = '';
  }

  goBack() {
  this.router.navigate(['/dapatdriver']);
}
}
