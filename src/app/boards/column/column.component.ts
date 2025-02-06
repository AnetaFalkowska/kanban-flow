import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { TaskCardComponent } from '../../task-card/task-card.component';
import { Task } from '../../shared/task.model';
import { Column } from '../../shared/column.model';
import {
  CdkDrag,
  CdkDragDrop,
  CdkDropList,
  DragDropModule,
} from '@angular/cdk/drag-drop';
import { TaskService } from '../../shared/task.service';
import {
  ActivatedRoute,
  ParamMap,
  Router,
  RouterModule,
} from '@angular/router';
import { StateService } from '../../shared/state.service';
import { Subject, takeUntil } from 'rxjs';
import { EditableHeaderComponent } from '../../editable-header/editable-header.component';
import { ColumnService } from '../../shared/column.service';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-column',
  imports: [
    TaskCardComponent,
    DragDropModule,
    RouterModule,
    EditableHeaderComponent,
  ],
  templateUrl: './column.component.html',
  styleUrl: './column.component.scss',
  animations: [
    trigger('taskAnim', [
      transition('remove => void', [
        animate(150, style({ opacity: 0, height: 0 })),
      ]),
    ]),
  ],
})
export class ColumnComponent implements OnInit, OnDestroy {
  @Input() column: Column = { id: '', name: '', tasks: [] };
  @Output() dropEmitter = new EventEmitter<CdkDragDrop<any>>();
  @Output() deleteClick = new EventEmitter<void>();
  boardId: string | null = null;
  unsubscribe$ = new Subject<void>();
  taskAnimationState: 'add' | 'remove' | null = null;

  constructor(
    private readonly taskService: TaskService,
    private readonly stateService: StateService,
    private readonly columnService: ColumnService,
    private readonly route: ActivatedRoute,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.route.paramMap
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((paramMap: ParamMap) => {
        this.boardId = paramMap.get('id');
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  onDrop(event: CdkDragDrop<{ tasks: Task[], columnId: string }>) {
    this.dropEmitter.emit(event);
  }

  onUpdateColumnName(columnName: string) {
    if (this.boardId && this.column && columnName !== this.column.name) {
      this.columnService
        .updateColumnName(this.boardId, this.column.id, columnName)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe({
          error: (err) => console.error('Failed to update column name:', err),
        });
    }
  }

  deleteColumn() {
    this.deleteClick.emit();
  }

  addTask() {
    // this.stateService.setTaskContext(this.boardId, this.column.id);
    this.router.navigate(['/tasks/add'], {
      queryParams: {
        boardId: this.boardId,
        columnId: this.column.id
      }
    });
  }

  editTask(task: Task) {
    // this.stateService.setTaskContext(this.boardId, this.column.id);
    this.router.navigate([`/tasks/${task?.id}/edit`], {
      queryParams: {
        boardId: this.boardId,
        columnId: this.column.id
      }
    });
  }

  onDeleteTask(task: Task) {
    if (this.boardId) {
      this.taskAnimationState = 'remove';
      this.taskService
        .deleteTask(this.boardId, this.column.id, task.id)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe({
          next: () => {
            this.column = {
              ...this.column,
              tasks: this.column.tasks.filter((t) => t.id !== task.id),
            };
            setTimeout(() => (this.taskAnimationState = null), 200);
          },
          error: (err) => console.error('Failed to delete task:', err),
        });
    }
  }
}
