import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { RealtimeDBService } from '../../../services/realtime-db.service';
import { CommonModule } from '@angular/common';
import { user } from '@angular/fire/auth';
import { Router } from '@angular/router';

import { MatDividerModule } from '@angular/material/divider';
import { ChatComponent } from "../chat/chat.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, MatDividerModule, ChatComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  users: any[] = [];
  selectedChat: any;

  constructor(private db : RealtimeDBService, private router : Router, private cdr: ChangeDetectorRef) {}

  ngOnInit() {

    this.db.getUserList().then(users => {
      this.users = users;
      this.users.forEach(element => {
        this.db.getLastMessage(element.uid).then((message) => {
          element.lastMessage = message;
        });

      });
      console.log(users)
    });
  }

  goToChat(recipientId: any): void {
    console.log(recipientId)
    this.selectedChat = recipientId;
  }
}
