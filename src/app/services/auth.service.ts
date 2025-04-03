import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import firebase from 'firebase/app';
import 'firebase/auth';
import { Router } from '@angular/router';
import { User } from '../models/userModel';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    constructor(
        private afAuth: AngularFireAuth,
        private router: Router
    ) { }

    async signup(email: string, password: string, role: string = 'client') {
        try {
            const result = await this.afAuth.createUserWithEmailAndPassword(email, password);
            const token = await result.user?.getIdTokenResult();
            const expiration = token?.expirationTime;
            const refreshToken = result.user?.refreshToken;
            const localId = result.user?.uid;
            const newUser: User = {
                email: email,
                refreshToken: refreshToken || '',
                localId: localId || '',
                expirationDate: expiration || '',
                role: role
            };
            sessionStorage.setItem('userData', JSON.stringify(newUser));
            const encodedSessionData = this.getEncodedSessionData(newUser);
            this.redirectToRespectiveApplication(role, encodedSessionData);
        } catch (error) {
            throw error;
        }
    }

    async login(email: string, password: string, role: string) {
        try {
            const result = await this.afAuth.signInWithEmailAndPassword(email, password);
            const token = await result.user?.getIdTokenResult();
            const expiration = token?.expirationTime;
            const refreshToken = result.user?.refreshToken;
            const localId = result.user?.uid;
            const loggedInUser: User = {
                email,
                refreshToken: refreshToken || '',
                localId: localId || '',
                expirationDate: expiration || '',
                role
            };
            sessionStorage.setItem('userData', JSON.stringify(loggedInUser));
            const encodedSessionData = this.getEncodedSessionData(loggedInUser);
            this.redirectToRespectiveApplication(role, encodedSessionData);
        } catch (error) {
            throw error;
        }
    }

    async googleLogin(role: string = 'client') {
        try {
            const provider = new firebase.auth.GoogleAuthProvider();
            const result = await this.afAuth.signInWithPopup(provider);
            const token = await result.user?.getIdTokenResult();
            const expiration = token?.expirationTime;
            const refreshToken = result.user?.refreshToken;
            const localId = result.user?.uid;
            const email = result.user?.email || '';
            const googleUser: User = {
                email,
                refreshToken: refreshToken || '',
                localId: localId || '',
                expirationDate: expiration || '',
                role
            };
            sessionStorage.setItem('userData', JSON.stringify(googleUser));
            const encodedSessionData = this.getEncodedSessionData(googleUser);
            this.redirectToRespectiveApplication(role, encodedSessionData);
        } catch (error) {
            throw error;
        }
    }

    async logout() {
        await this.afAuth.signOut();
        sessionStorage.removeItem('userData');
        this.router.navigate(['/login']);
    }

    getCurrentUser(): User | null {
        const userData = sessionStorage.getItem('userData');
        return userData ? JSON.parse(userData) : null;
    }

    getEncodedSessionData(session_data: any): string {
        return btoa(JSON.stringify(session_data));
    }

    redirectToRespectiveApplication(role: string, encodedSessionData: any): void {
        if (role === 'client') {
            window.location.href = `${environment.clientAppUrl}?session=${encodedSessionData}`;
        } else {
            window.location.href = `${environment.sellerAppUrl}?session=${encodedSessionData}`;
        }
    }
}
