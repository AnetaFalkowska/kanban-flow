import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  inject,
  Input,
  Output,
} from '@angular/core';
import { Task } from '../shared/task.model';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { TaskViewComponent } from '../task-view/task-view.component';
import { Router } from '@angular/router';
import { StateService } from '../shared/state.service';
import { TaskService } from '../shared/task.service';
import { of, switchMap } from 'rxjs';

@Component({
  selector: 'app-task-card',
  imports: [MatButtonModule, MatDialogModule],
  templateUrl: './task-card.component.html',
  styleUrl: './task-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskCardComponent {
  @Input() task?: Task;
  @Input() columnId?: string;
  
  @Output() deleteClick: EventEmitter<void> = new EventEmitter<any>();

  readonly dialog = inject(MatDialog);
  private router = inject(Router);

  constructor(
    private readonly stateService: StateService,
    private readonly taskService: TaskService
  ) {}

  openDialog() {
    const dialogRef = this.dialog.open(TaskViewComponent, {
      data: { task: this.task },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === true && this.columnId) {
        this.stateService.setColumnId(this.columnId);
        this.router.navigate([`/tasks/${this.task?.id}/edit`]);
      }
    });
  }

  toggleCompleted() {
    if (!this.task) return;

    this.task.completed = !this.task.completed;

    this.stateService.currentTaskCtx
      .pipe(
        switchMap((params) => {
          const boardId = params?.boardId;
          if (boardId && this.columnId && this.task) {
            console.log(!this.task.completed);
            return this.taskService.updateTask(
              boardId,
              this.columnId,
              this.task.id,
              { completed: this.task.completed }
            );
          }
          return of(null);
        })
      )
      .subscribe({
        next: (updatedTask) => {
          if (updatedTask) {
            this.task = updatedTask;
          }
        },
        error: (err) => console.error('Error updating task:', err),
      });
  }

  onDeleteClick() {
    this.deleteClick.emit();
  }
}
