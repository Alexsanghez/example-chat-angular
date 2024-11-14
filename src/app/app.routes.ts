import { Routes } from '@angular/router';
import { AuthenticationComponent } from './components/authentication/authentication.component';

export const routes: Routes = [


  {
    path: '',
    async loadComponent() {
      const m = await import(
        './components/authentication/authentication.component'
      );
      return m.AuthenticationComponent;
    },
  },
  {
    path: 'home',
    async loadComponent() {
      const m = await import(
        './components/home/home.component'
      );
      return m.HomeComponent;
    },
  },
  {
    path: 'chat',
    async loadComponent() {
      const m = await import(
        './components/chat/chat.component'
      );
      return m.ChatComponent;
    },
  },
];
