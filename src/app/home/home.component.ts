import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  todos: [any];

  logoutSubscribe: Subscription;

  authTokenOptions = {
    headers: new HttpHeaders({
      'x-auth': localStorage.getItem('token')
    }),
    observe: 'response' as 'response'
  };

  constructor(private authService: AuthService, private http: HttpClient, private router: Router) { }

  ngOnInit() { }

  // Logout
  onLogout() {

    this.logoutSubscribe = this.http
      .delete<any>('https://what-todo-be.herokuapp.com/logout', this.authTokenOptions)
      .subscribe((response) => {

        if (response.status === 200) {
          
          localStorage.removeItem('token');

          this.router.navigate(['']);

        }

        this.logoutSubscribe.unsubscribe();

      });

  }

}
