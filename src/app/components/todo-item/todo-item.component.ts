import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Todo } from 'src/app/models/todo.model';
import { trigger, state, style, transition, animate } from '@angular/animations';

// const fadeStrikeAnimation = trigger(...như dưới);
// Khai báo riêng có thể sử dụng ở nhiều nơi khác

@Component({
  selector: 'app-todo-item',
  templateUrl: './todo-item.component.html',
  styleUrls: ['./todo-item.component.scss'],
  animations: [
    trigger('fadeStrike', [
    state('active', style({
      fontSize: '18px',
      color: 'black'
    })),
    state('completed', style({
      fontSize: '17px',
      color: 'lightgrey',
      textDecoration: 'line-through'
    })),
    transition('active <=> completed', [animate(150)])
    ])
  ]
  // animation: [fadeStrikeAnimation]
})
export class TodoItemComponent implements OnInit {
 @Input() todo: Todo;
 @Output() changeStatus: EventEmitter<Todo> = new EventEmitter<Todo>();
 @Output() editTodo: EventEmitter<Todo> = new EventEmitter<Todo>();
 @Output() deleteTodo: EventEmitter<Todo> = new EventEmitter<Todo>();

  isHovered = false;
  isEditing = false;

  constructor() { }

  ngOnInit() {
  }

  changeTodoStatus() {
    this.changeStatus.emit({...this.todo, isCompleted: !this.todo.isCompleted});
    // Trả về 1 clone của todo với isCompleted ngược với hiện có
  }

  submitEdit(event: KeyboardEvent) {
    // tslint:disable-next-line: deprecation
    const { keyCode } = event;
    event.preventDefault(); // Default: Auto submit
    if (keyCode === 13) {
      this.editTodo.emit(this.todo);
      this.isEditing = false;
    }
  }

  removeTodo() {
    this.deleteTodo.emit(this.todo);
  }
}
