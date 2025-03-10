import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { TaskCardComponent } from '../../../../../shared/task-card/task-card.component';
import { Task } from '../../../../../api/task.model';
import { Column } from '../../../../../api/column.model';
import {
  CdkDrag,
  CdkDragDrop,
  CdkDropList,
  DragDropModule,
} from '@angular/cdk/drag-drop';
import { TaskService } from '../../../../../api/task.service';
import {
  ActivatedRoute,
  ParamMap,
  Router,
  RouterModule,
} from '@angular/router';
import { StateService } from '../../../../../core/services/state.service';
import { Subject, take, takeUntil } from 'rxjs';
import { EditableHeaderComponent } from '../../../../../shared/editable-header/editable-header.component';
import { ColumnService } from '../../../../../api/column.service';
import { animate, style, transition, trigger } from '@angular/animations';
import { NgClass, NgStyle } from '@angular/common';
import { CalendarUtilsService } from '../../../../../core/services/calendar-utils.service';
import { NotificationService } from '../../../../../core/services/notification.service';

@Component({
  selector: 'app-column',
  imports: [
    TaskCardComponent,
    DragDropModule,
    RouterModule,
    EditableHeaderComponent,
    NgStyle,
    NgClass,
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
export class ColumnComponent implements OnDestroy, OnInit {
  @Input() column: Column = { id: '', name: '', tasks: [] };
  @Input() boardId?: string;
  highlightedTaskId: string | null = null;
  highlightedColumnId: string | null = null;
  @Output() dropEmitter = new EventEmitter<CdkDragDrop<any>>();
  @Output() deleteClick = new EventEmitter<void>();
  unsubscribe$ = new Subject<void>();
  taskAnimationState: 'add' | 'remove' | null = null;

  constructor(
    private readonly taskService: TaskService,
    private readonly columnService: ColumnService,
    private readonly calendarUtilsService: CalendarUtilsService,
    private readonly stateService: StateService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.stateService.highlightedTask
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((highlight) => {
        if (highlight) {
          this.highlightedTaskId = highlight.taskId;
          this.highlightedColumnId = highlight.columnId;
          this.scrollToHighlightedTask();
        }
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  scrollToHighlightedTask() {
    if (!this.highlightedTaskId) return;
    setTimeout(() => {
      const taskElement = document.getElementById(
        `task-${this.highlightedTaskId}`
      );
      if (taskElement) {
        taskElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 200);
  }

  highlightTask(taskId: string, columnId: string) {
    return {
      highlighted:
        taskId === this.highlightedTaskId &&
        columnId === this.highlightedColumnId,
    };
  }

  onDrop(event: CdkDragDrop<{ tasks: Task[]; columnId: string }>) {
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
    if (this.boardId && this.column.id) {
      // this.stateService.setTaskContext(this.boardId, this.column.id);
      this.router.navigate(['/tasks/add'], {
        queryParams: {
          boardId: this.boardId,
          columnId: this.column.id,
        },
      });
    }
  }

  editTask(task: Task) {
    if (this.boardId && task.id && this.column.id) {
      this.router.navigate([`/tasks/${task?.id}/edit`], {
        queryParams: {
          boardId: this.boardId,
          columnId: this.column.id,
        },
      });
    }
  }

  onDeleteTask(task: Task) {
    if (this.boardId && task.id) {
      this.taskAnimationState = 'remove';
      this.taskService
        .deleteTask(this.boardId, this.column.id, task.id)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe({
          next: () => {
            if (this.boardId && this.column.id) {
              const index = this.column.tasks.findIndex(
                (t) => t.id === task.id
              );
              if (index !== -1) {
                this.stateService.setLastDeletedTask(
                  this.boardId,
                  this.column.id,
                  index,
                  task
                );
              }
              this.column = {
                ...this.column,
                tasks: this.column.tasks.filter((t) => t.id !== task.id),
              };
            }
            setTimeout(() => (this.taskAnimationState = null), 200);
            this.notificationService.openSnackBar(
              'Task deleted',
              'Undo',
              3000,
              () => {
                this.restoreTask();
              }
            );
          },
          error: (err) => console.error('Failed to delete task:', err),
        });
    }
  }

  restoreTask() {
    const lastDeletedTask = this.stateService.getLastDeletedTask();

    if (lastDeletedTask && this.boardId) {
      this.taskService
        .restoreTask(
          lastDeletedTask.boardId,
          lastDeletedTask.columnId,
          lastDeletedTask.task,
          lastDeletedTask.index,          
          "board-view"
        )
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe((restoredTask) => {
          if (this.column.id === lastDeletedTask.columnId) {
            const updatedTasks = [...this.column.tasks]; 
            updatedTasks.splice(lastDeletedTask.index, 0, restoredTask);
          
            this.column = {
              ...this.column,
              tasks: updatedTasks,
            };
          }
          this.stateService.clearLastDeletedTask();
        });
    }
  }

  getPriorityColor(
    completed: boolean,
    priority: 'high' | 'medium' | 'low' | null | undefined,
    duedate: String | undefined
  ) {
    return this.calendarUtilsService.getPriorityColor(
      completed,
      priority,
      duedate as string | undefined
    );
  }
}
