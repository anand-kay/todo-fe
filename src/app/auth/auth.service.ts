import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Injectable()
export class AuthService {

    token: string;

    singupSubscribe: Subscription;
    loginSubscribe: Subscription;

    constructor(private http: HttpClient, private router: Router) { }

    signup(email: string, password: string) {

        this.singupSubscribe = this.http
            .post<any>('https://what-todo-be.herokuapp.com/signup', { email, password })
            .subscribe((response) => {

                localStorage.setItem('token', response.token);

                this.router.navigate(['/home']);

                this.singupSubscribe.unsubscribe();

            });

    }

    login(email: string, password: string) {

        this.loginSubscribe = this.http
            .post<any>('https://what-todo-be.herokuapp.com/login', { email, password })
            .subscribe((response) => {

                localStorage.setItem('token', response.token);

                this.router.navigate(['/home']);

                this.loginSubscribe.unsubscribe();

            });

    }

}