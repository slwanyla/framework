import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
  standalone: false,
})
export class ChatPage implements OnInit, OnDestroy {
  chatMessages: { sender: 'user' | 'driver'; text: string; timestamp: string }[] = [];
  messageInput: string = '';
  currentSender: 'user' | 'driver' = 'user';
  chatWith: string = 'Chat';
  orderId: number = 0;
  intervalId: any;
  from: string = '';

  constructor(private route: ActivatedRoute, private router: Router,) {}

  ngOnInit() {
    this.from = this.route.snapshot.queryParamMap.get('from') || '';
    this.orderId = parseInt(this.route.snapshot.queryParamMap.get('orderId') || '0');

    // Ambil role dari localStorage
  const senderParam = this.route.snapshot.queryParamMap.get('sender');
  console.log('Sender param:', senderParam);
  const role = senderParam || localStorage.getItem('user_type'); 
  this.currentSender = senderParam === 'driver' ? 'driver' : 'user';

    // Update judul sesuai role login
    this.chatWith = this.currentSender === 'driver'
      ? 'Chat dengan Pengguna'
      : 'Chat dengan Driver';

    
  console.log('Chat With:', this.chatWith); // Cek apakah berubah

    this.loadMessages();

    this.intervalId = setInterval(() => {
      this.loadMessages();
    }, 3000);
  }

  ngOnDestroy(): void {
    clearInterval(this.intervalId);
  }

  loadMessages() {
    fetch(`http://localhost:8000/api/chat/${this.orderId}`, {
      headers: { Accept: 'application/json' }
    })
      .then(res => res.json())
      .then(response => {
        const messages = response.data || [];
        this.chatMessages = messages.map((msg: any) => ({
          sender: msg.sender,
          text: msg.message,
          timestamp: msg.created_at
        }));
      })
      .catch(err => console.error('❌ Gagal mengambil pesan:', err));
  }

  kirimPesan() {
    if (!this.messageInput.trim()) return;

    fetch('http://localhost:8000/api/chat/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        order_id: this.orderId,
        sender: this.currentSender,
        message: this.messageInput.trim()
      })
    })
      .then(res => res.json())
      .then(() => {
        this.messageInput = '';
        this.loadMessages();
      })
      .catch(err => console.error('❌ Gagal mengirim pesan:', err));
  }

  goBack() {
    const routes: any = {
      'dapatdriver': '/dapatdriver',
      'sampaitujuan': '/sampaitujuan',
      'jemputpenumpang': '/jemputpenumpang',
      'penumpangnaik': '/penumpangnaik',
      'tujuanakhir': '/tujuanakhir',
      'ringkasanorder': '/ringkasanorder'
    };
    this.router.navigate(['/chat'], {
  queryParams: {
    orderId: this.orderId,
    from: 'dapatdriver',
    sender: 'driver' // atau 'user'
  }
});

  }
}
