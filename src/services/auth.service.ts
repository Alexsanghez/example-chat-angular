import { Inject, inject, Injectable } from '@angular/core';
import { Auth, User, user, createUserWithEmailAndPassword, signOut, getAuth, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup  } from '@angular/fire/auth';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  @Inject(GoogleAuthProvider)provider: GoogleAuthProvider = new GoogleAuthProvider;

   constructor(private auth: Auth) {
    this.provider.addScope('https://www.googleapis.com/auth/contacts.readonly');
   }


  signUp(email: string, password: string) {
    return createUserWithEmailAndPassword(this.auth,email, password);
  }

  // Sign in with email and password
  signIn(email: string, password: string) {

    return signInWithEmailAndPassword(this.auth, email, password);
  }

  // Sign out the current user
  signOut() {
    return signOut(this.auth);
  }

  signWithPopUp(){
    return signInWithPopup(this.auth, this.provider);
  }

  getUserId(): string {
    const user = this.auth.currentUser;
    return user ? user.uid : ''; // Restituisce l'UID dell'utente se loggato
  }







}
