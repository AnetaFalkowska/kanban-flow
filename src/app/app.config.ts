import {
  ApplicationConfig,
  importProvidersFrom,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';


const firebaseConfig = {
  apiKey: "AIzaSyBq_-1Ro24kvZCsg9kGJBRRb19QMevK39E",
  authDomain: "kanbanflow-c37fe.firebaseapp.com",
  projectId: "kanbanflow-c37fe",
  storageBucket: "kanbanflow-c37fe.firebasestorage.app",
  messagingSenderId: "409557465026",
  appId: "1:409557465026:web:bc365b07670690b6b7085b"
};


export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideFirestore(() => getFirestore()),
  ],
};
