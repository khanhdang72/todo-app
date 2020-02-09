import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Todo } from '../models/todo.model';
import { Filter } from '../models/filtering.model';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  private static readonly TodoStorageKey = 'todos';
  private todos: Todo[];
  private filteredTodos: Todo[];
  private lengthSubject: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  private displayTodosSubject: BehaviorSubject<Todo[]> = new BehaviorSubject<Todo[]>([]);
  private currentFilter: Filter = Filter.All;

  todos$: Observable<Todo[]> = this.displayTodosSubject.asObservable();
  length$: Observable<number> = this.lengthSubject.asObservable();

  constructor(
    private storageService: LocalStorageService
  ) { }

  addTodo(content: string) {
    const date = new Date(Date.now()).getTime(); // Unique id
    const newTodo = new Todo(date, content);
    this.todos.unshift(newTodo); // Add lên đầu
    this.updateToLocalStorage();
  }

  changeTodoStatus(id: number, isCompleted: boolean) {
    const index = this.todos.findIndex(t => t.id === id);
    const todo = this.todos[index];
    todo.isCompleted = isCompleted;
    this.todos.splice(index, 1, todo);
    this.updateToLocalStorage();
  }

  editTodo(id: number, content: string) {
    const index = this.todos.findIndex(t => t.id === id);
    const todo = this.todos[index];
    // Lấy thứ tự todo
    todo.content = content;
    // todo.content (cũ) được update bằng content (mới)
    this.todos.splice(index, 1, todo);
    // Cắt bỏ todo cũ ở index nhận được, thay bằng todo mới
    this.updateToLocalStorage();
  }

  deleteTodo(id: number) {
    const index = this.todos.findIndex(t => t.id === id);
    this.todos.splice(index, 1);
    this.updateToLocalStorage();
  }

  toggleAll() {
    this.todos = this.todos.map(todo => {
      return {
        ...todo, // Lấy id và content, thay đổi isCompleted
        isCompleted: !this.todos.every(t => t.isCompleted)
        // All True = True; All False = False; 1T1F = False
        // Dùng ! để 1T1F = True
      };
    });
    this.updateToLocalStorage();
  }

  clearCompleted() {
    this.todos = this.todos.filter(todo => !todo.isCompleted);
    this.updateToLocalStorage();
    // Trả lại những todo chưa completed
  }

  fetchFromLocalStorage() {
    this.todos = this.storageService.getValue<Todo[]>(TodoService.TodoStorageKey) || [];
    // shallowClone để dùng animation
    this.filteredTodos = [...this.todos];
    // deepClone lodash
    // this.filteredTodos = [...this.todos.map(todo => ({...todo}))];
    this.updateTodosData();
  }

  updateToLocalStorage() {
    this.storageService.setObject(TodoService.TodoStorageKey, this.todos);
    this.filterTodos(this.currentFilter, false);
    this.updateTodosData();
  }

  filterTodos(filter: Filter, isFiltering: boolean = true) {
    this.currentFilter = filter;
    switch (filter) {
      case Filter.Active:
        this.filteredTodos = this.todos.filter(todo => !todo.isCompleted);
        break;
      case Filter.Completed:
        this.filteredTodos = this.todos.filter(todo => todo.isCompleted);
        break;
      case Filter.All:
        // shallowClone
        this.filteredTodos = [...this.todos];
        // deepClone
        // this.filteredTodos = [...this.todos.map(todo => ({...todo}))];
        break;
    }
    if (isFiltering) {
      this.updateTodosData();
    }
  }

  private updateTodosData() {
    this.displayTodosSubject.next(this.filteredTodos);
    this.lengthSubject.next(this.todos.length);
  }
}
