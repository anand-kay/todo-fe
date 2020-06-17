import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subscription } from 'rxjs';

import { HomeService } from '../home.service';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.css']
})
export class TodoListComponent implements OnInit, OnDestroy {

  todos = [];
  pages = [];

  currentPage;

  todosSubscribe: Subscription;
  homeSubscribe: Subscription;
  newTodoSubscribe: Subscription;
  doneSubscribe: Subscription;
  deleteSubscribe: Subscription;

  authTokenOptions = {
    headers: new HttpHeaders({
      'x-auth': localStorage.getItem('token')
    }),
    observe: 'response' as 'response'
  };

  constructor(private http: HttpClient, private homeService: HomeService) { }

  ngOnInit() {

    // Fetch Todos page-wise
    this.fetchPagewise(0);

    this.homeSubscribe = this.homeService.currentMessage.subscribe((message) => {

      if (message && message !== '') {

        console.log('nowww');

        const newTodoEntry = { text: message };

        this.newTodoSubscribe = this.http
          .post<any>('https://what-todo-be.herokuapp.com/newtodo', newTodoEntry, this.authTokenOptions)
          .subscribe((response) => {

            if (response.status == 200) {

              this.fetchPagewise(this.currentPage);

            }

            if (this.newTodoSubscribe) {
              this.newTodoSubscribe.unsubscribe();
            }

          });

        this.homeService.changeMessage('');

      }

      // if (this.homeSubscribe) {
      //   this.homeSubscribe.unsubscribe();
      // }

    });

  }

  onDoneClicked(cb, i) {

    this.todos[i].done = cb.checked;

    this.doneSubscribe = this.http
      .patch<any>(
        'https://what-todo-be.herokuapp.com/updatedone',
        { id: this.todos[i]._id, done: this.todos[i].done },
        this.authTokenOptions
      ).subscribe((response) => {
        this.doneSubscribe.unsubscribe();
      });

  }

  // Delete
  onDelete(i) {

    const authDeleteTokenOptions = {
      headers: new HttpHeaders({
        'x-auth': localStorage.getItem('token'),
        'x-id': this.todos[i]._id
      }),
      observe: 'response' as 'response'
    };

    this.deleteSubscribe = this.http
      .delete<any>('https://what-todo-be.herokuapp.com/delete', authDeleteTokenOptions)
      .subscribe((response) => {

        if (response.status == 200) {

          // Fetch Todos page-wise
          this.fetchPagewise(this.currentPage);

        }

        this.deleteSubscribe.unsubscribe();

      });

  }

  // Fetch Todos page-wise
  fetchPagewise(i) {

    this.currentPage = i;

    this.todosSubscribe = this.http
      .get<any>(`https://what-todo-be.herokuapp.com/fetch?page=${(i + 1)}`, this.authTokenOptions)
      .subscribe((response) => {

        this.todos = response.body.todos;

        this.pages = [];

        for (let i = 0; i < (+response.body.totalCount / 7); i++) {

          this.pages.push(i + 1);

        }

        this.todosSubscribe.unsubscribe();

      });

  }

  ngOnDestroy() {
    // this.todosSubscribe.unsubscribe();
    this.homeSubscribe.unsubscribe();
  }

}
