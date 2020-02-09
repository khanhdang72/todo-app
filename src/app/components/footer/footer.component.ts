import { Component, OnInit, OnDestroy } from '@angular/core';
import { FilterButton, Filter } from 'src/app/models/filtering.model';
import { TodoService } from 'src/app/services/todo.service';
import { Observable, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit, OnDestroy {
  filterButtons: FilterButton[] = [
    { type: Filter.All, label: 'All', isActive: true },
    { type: Filter.Active, label: 'Active', isActive: false },
    { type: Filter.Completed, label: 'Completed', isActive: false },
  ];

  length = 0;
  hasComplete$: Observable<boolean>;
  destroy$: Subject<null> = new Subject<null>();

  constructor(
    private todoService: TodoService
  ) {}

  ngOnInit() {
    this.hasComplete$ = this.todoService.todos$.pipe(
      map(todos => todos.some(t => t.isCompleted)), // Nếu có 1 hoặc nhiều isCompleted, return true
      takeUntil(this.destroy$)
      // todos$ trả giá trị cho đến khi takeUntil nhận dc giá trị từ destroy$
      // Footer thực hiện ngOnDestroy nếu ko có todo
      // Khi đó, đẩy giá trị (next lên destroy$)
    );

    this.todoService.length$.pipe(
      takeUntil(this.destroy$)).subscribe(
        length => { this.length = length; }
      );
  }

  filter(type: Filter) {
    this.setActiveFilterBtn(type);
    this.todoService.filterTodos(type);
  }

  private setActiveFilterBtn(type: Filter) {
    this.filterButtons.forEach(btn => {
      btn.isActive = btn.type === type;
      // btn.isActive trùng với type được truyền vào
    });
  }

  clearCompleted() {
    this.todoService.clearCompleted();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
