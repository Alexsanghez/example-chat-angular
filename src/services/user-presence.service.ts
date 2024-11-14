import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { Database, object, onDisconnect, onValue, set } from '@angular/fire/database';
import { ref } from 'firebase/database';

@Injectable({
  providedIn: 'root'
})
export class UserPresenceService {

  constructor(private db : Database, private auth: Auth) {
  }

  updateUserPresence() {
    this.auth.onAuthStateChanged((user) => {
      if (user) {
        const uid = user.uid;
        const userStatusRef = ref(this.db,`/users/${uid}/status`);

        // Monitor the connection state.
        const connectedRef = ref(this.db, '.info/connected');
        onValue(connectedRef, (snapshot) => {
          const connected = snapshot.val();
          console.log(connected)
          if (connected === true) {
            // Set user as online.
            set(userStatusRef ,'online');

            // Set user as offline when they disconnect.
            onDisconnect(userStatusRef).set('offline');
            onDisconnect(ref(this.db,`/users/${uid}/lastOnline`)).set(new Date().toISOString());
          }
        });
      }
    });
  }
}
