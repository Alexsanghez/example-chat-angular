import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment.development';
import { provideAuth,  } from '@angular/fire/auth';
import { getAuth } from 'firebase/auth';
import { provideDatabase } from '@angular/fire/database';
import { getDatabase } from 'firebase/database';

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }),
              provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
              provideRouter(routes),
              provideAnimationsAsync(),
              provideAuth(() => getAuth()),
              provideDatabase(() => getDatabase()),

              ]
};
