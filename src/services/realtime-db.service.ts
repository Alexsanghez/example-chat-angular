
import { Inject, Injectable } from '@angular/core';
import { getDatabase, ref, set, push, query,  onValue, orderByChild, Database  } from '@angular/fire/database';
import { get, limitToLast } from 'firebase/database';
import { AuthService } from './auth.service';
@Injectable({
  providedIn: 'root'
})
export class RealtimeDBService {

  constructor(private db : Database, private authService: AuthService) {
  }

  // Create a new user
  async addUser(uid: string, userData: any): Promise<void> {
    const userRef = ref(this.db, `users/${uid}`);
    return set(userRef, userData);
  }

  async getUserList(): Promise<any[]> {
    const usersRef = ref(this.db, 'users');  // Riferimento al nodo "users"
    const snapshot = await get(usersRef);    // Ottieni i dati

    if (snapshot.exists()) {
      const data = snapshot.val();
      return Object.keys(data).map(key => ({ id: key, ...data[key] }));
    } else {
      return [];  // Nessun dato trovato
    }
  }

  async sendMessage(chatId: string, senderId: string, recipientId: string, text: string): Promise<void> {
    const messagesRef = ref(this.db, `chats/${chatId}/messages`);
    const newMessageRef = push(messagesRef); // Genera un ID univoco per il messaggio

    const messageData = {
      senderId,
      recipientId,
      text,
      timestamp: Date.now()
    };

    return set(newMessageRef, messageData); // Salva il messaggio nel database
  }

  getMessages(chatId: string, callback: (messages: any[]) => void): void {
    const messagesRef = ref(this.db, `chats/${chatId}/messages`);
    const messagesQuery = query(messagesRef, orderByChild('timestamp'));

    onValue(messagesQuery, (snapshot) => {
      const data = snapshot.val();
      const messages = data ? Object.keys(data).map((key) => ({ id: key, ...data[key] })) : [];
      callback(messages);
    });
  }

  async getLastMessage(recipientId : string): Promise<any> {
    const chatId = this.generateChatId(this.authService.getUserId(), recipientId);
    const messagesRef = ref(this.db, `chats/${chatId}/messages`);
    const messagesQuery = query(messagesRef, orderByChild('timestamp'), limitToLast(1));
    const snapshot = await get(messagesQuery);

    if (snapshot.exists()) {
      const data = snapshot.val();
      return Object.keys(data).map(key => ({ id: key, ...data[key] }))[0];
    } else {
      return null;  // Nessun messaggio trovato
    }
  }

  private generateChatId(userId1: string, userId2: string): string {
    // Sort user IDs to ensure the chatId is consistent regardless of the input order
    const sortedIds = [userId1, userId2].sort();

    // Concatenate the sorted user IDs (you can add a delimiter like '-' to separate them)
    const chatId = sortedIds.join('-');

    return chatId;
  }




}
