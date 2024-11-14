import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { RealtimeDBService } from '../../../services/realtime-db.service';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss'
})
export class ChatComponent implements OnInit, OnChanges {

  messages: any[] = [];
  messageText: string = '';
  @Input()recipient!: any;
  chatId = "";


  constructor(
    private chatService: RealtimeDBService, private authService : AuthService, private router: Router// Usa un servizio di autenticazione per ottenere l'ID dell'utente
  ) {

  }

  generateChatId(userId1: string, userId2: string): string {
    // Sort user IDs to ensure the chatId is consistent regardless of the input order
    const sortedIds = [userId1, userId2].sort();

    // Concatenate the sorted user IDs (you can add a delimiter like '-' to separate them)
    const chatId = sortedIds.join('-');

    return chatId;
  }

 ngOnChanges(changes: SimpleChanges): void {
    if (changes['recipientId'] && changes['recipientId'].currentValue) {
      this.chatId = this.generateChatId(this.authService.getUserId(), this.recipient.id); // Crea un ID univoco per la chat
      this.chatService.getMessages(this.chatId, (data) => {
        this.messages = data;
      });
    }
 }

  ngOnInit() {

  }

  sendMessage() {
    const senderId = this.authService.getUserId(); // Ottieni l'ID dell'utente autenticato
    const text = this.messageText.trim();
    console.log(this.chatId, senderId, this.recipient.id, text)
    if (text) {
      this.chatService.sendMessage(this.chatId, senderId, this.recipient.id, text).then(() => {
        this.messageText = ''; // Pulisce il campo di input dopo l'invio
      });
    }
  }
}
