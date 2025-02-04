import {
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
  // animations: [
  //   trigger('taskAnim', [
  //     transition('*=>remove', [animate(200, style({ opacity: 0, height: 0 }))]),
  //     transition('*=>add', [
  //       style({ opacity: 0, transform: 'scale(0.8)' }),
  //       animate(
  //         '250ms 120ms ease-out',
  //         style({ opacity: 1, transform: 'scale(1)' })
  //       ),
  //     ]),
  //   ]),
  // ],
  animations: [
    trigger('taskAnim', [
      transition('void => add', [
        style({ opacity: 0, transform: 'scale(0.9)' }),
        animate(
          '250ms 120ms ease-out',
          style({ opacity: 1, transform: 'scale(1)' })
        ),
      ]),
      transition('remove => void', [
        animate(200, style({ opacity: 0, height: 0 })),
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
    private taskService: TaskService,
    private stateService: StateService,
    private columnService: ColumnService,
    private route: ActivatedRoute,
    private router: Router
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

  onDrop(e: CdkDragDrop<any>) {
    this.dropEmitter.emit(e);
  }

  updateColumnName(columnName: string) {
    if (this.boardId && this.column && columnName !== this.column.name) {
      console.log('updating')
      this.columnService
        .updateColumnName(this.boardId, this.column.id, columnName)
        .subscribe();
    }
  }

  onEditClick(task: Task) {
    this.stateService.setTaskContext(this.boardId, this.column.id);
    this.router.navigate([`/tasks/${task?.id}/edit`]);
  }

  onDeleteClick(task: Task) {
    if (this.boardId) {
      this.taskAnimationState = 'remove';
      this.taskService
        .deleteTask(this.boardId, this.column.id, task.id)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(() => {
          this.column.tasks = this.column.tasks.filter((t) => t.id !== task.id);
          setTimeout(() => (this.taskAnimationState = null), 250);
        });
    }
  }

  deleteColumn() {
    this.deleteClick.emit();
  }

  onAddTask() {
    // this.stateService.setTaskContext(this.boardId, this.column.id);
    if (this.boardId) {
      this.taskAnimationState = 'add';
      this.taskService
        .addTask(this.boardId, this.column.id, new Task('Task name'))
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe((createdTask) => {
          this.column.tasks.push(createdTask);
          setTimeout(() => (this.taskAnimationState = null), 250);
        });
    }
    // this.router.navigateByUrl('/tasks/add');
  }
}
