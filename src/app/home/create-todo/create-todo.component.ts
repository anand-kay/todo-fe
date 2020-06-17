import { Component, OnInit } from '@angular/core';

import { HomeService } from '../home.service';

@Component({
  selector: 'app-create-todo',
  templateUrl: './create-todo.component.html',
  styleUrls: ['./create-todo.component.css']
})
export class CreateTodoComponent implements OnInit {

  constructor(private homeService: HomeService) { }

  ngOnInit() {
  }

  onSave(todoinput) {

    this.homeService.changeMessage(todoinput.value);

    todoinput.value = '';

  }

}
