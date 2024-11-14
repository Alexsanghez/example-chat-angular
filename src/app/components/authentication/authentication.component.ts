import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators,  } from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatCardModule} from '@angular/material/card';
import { Router } from '@angular/router';
import { RealtimeDBService } from '../../../services/realtime-db.service';
import { GoogleAuthProvider } from 'firebase/auth';
import { UserPresenceService } from '../../../services/user-presence.service';

@Component({
  selector: 'app-authentication',
  standalone: true,
  imports: [  ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatCardModule,
  MatIconModule],
  templateUrl: './authentication.component.html',
  styleUrl: './authentication.component.scss'
})
export class AuthenticationComponent {

  loginForm = new FormGroup({
    email: new FormControl('',[Validators.required, Validators.email]),
    password: new FormControl('', Validators.required)
  });



  constructor(private authService: AuthService, private router : Router, private db: RealtimeDBService, private userPresenceService : UserPresenceService) {}

  onSignIn() {
    this.authService.signIn(this.loginForm.get('email')!.value!,this.loginForm.get('password')!.value!).then((userCredential) => {
      this.router.navigate(['/home']);
      this.userPresenceService.updateUserPresence();
    }).catch((error) => {
      console.error('Error signing in:', error);
    });
  }

  onSignInWithGoogle() {
    this.authService.signWithPopUp().then((result) => {
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential?.accessToken;
      // The signed-in user info.
      const user = result.user;

      this.router.navigate(['/home']);
      this.userPresenceService.updateUserPresence();

    }).catch((error) => {
      console.error('Error signing in:', error);
    });
  }

  onSignUp() {
    this.authService.signUp(this.loginForm.get('email')!.value!,this.loginForm.get('password')!.value!).then((userCredential) => {
      if (userCredential.user) {
        const userData = {
          uid: userCredential.user.uid,
          email: userCredential.user.email,
          name: userCredential.user.displayName,
          createdAt: userCredential.user.metadata.creationTime,
        };
        this.db.addUser(userCredential.user.uid, userData);
        console.log('User data added to the database:', userData);
      }
      console.log('Signed up successfully:', userCredential.user);
    }).catch((error) => {
      console.error('Error signing up:', error);
    });
  }
}
