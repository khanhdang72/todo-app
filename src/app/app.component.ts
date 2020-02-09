import { Component, OnInit } from '@angular/core';
import { TodoService } from './services/todo.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  hasTodo$: Observable<boolean>;

  constructor(
    private todoService: TodoService
  ) {}
  ngOnInit() {
    this.todoService.fetchFromLocalStorage();
    this.hasTodo$ = this.todoService.length$.pipe(map(length => length > 0));
    // Give length$ a boolean result to match with hasTodo$
    // pipe() takes an Observable (length$) as its input and outputs another Observable
    // map() uses a function to turn the Observable type from <Number> to <Boolean>
  }
}
