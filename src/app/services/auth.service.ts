import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import {Router} from "@angular/router";
import { user } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private currentUserSubject: BehaviorSubject<user>;
    public currentUser: Observable<user>;

    constructor(private http: HttpClient, private router: Router) {
        this.currentUserSubject = new BehaviorSubject<user>(JSON.parse(localStorage.getItem('currentUser') || '{}'));
        this.currentUser = this.currentUserSubject.asObservable();
    }

    public get currentUserValue(): user {
        return this.currentUserSubject.value;
    }

    public get isLoggedIn(): boolean {
        if(this.currentUserSubject.value != null){
            return true;
        }else{
            return false;
        }
    }

    setJwt(userSesion: user): void {
        localStorage.setItem('currentUser', JSON.stringify(userSesion));
        this.currentUserSubject.next(userSesion);
    }

    logout() {
        // remove user from local storage and set current user to null
        localStorage.removeItem('currentUser');
        this.currentUserSubject.next(null!);
        this.router.navigate(['/login']);
    }
}
