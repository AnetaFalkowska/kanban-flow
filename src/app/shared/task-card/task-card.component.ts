import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { Task } from '../../api/task.model';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { TaskViewComponent } from '../task-view/task-view.component';
import { Router } from '@angular/router';
import { StateService } from '../../core/services/state.service';
import { TaskService } from '../../api/task.service';
import { of, switchMap } from 'rxjs';
import { DialogService } from '../../core/services/dialog.service';

@Component({
  selector: 'app-task-card',
  imports: [MatButtonModule, MatDialogModule],
  templateUrl: './task-card.component.html',
  styleUrl: './task-card.component.scss',
})
export class TaskCardComponent {
  @Input() task?: Task;
  @Input() columnId?: string;
  @Input() boardId?: string;
  @Input() source?: string;

  @Output() deleteClick: EventEmitter<void> = new EventEmitter<any>();
  @Output() toggleClick: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(
    private readonly stateService: StateService,
    private readonly dialogService: DialogService,
    private readonly taskService: TaskService
  ) {}

  openDialog() {
    if (this.task) {
      this.dialogService.openTaskDialog(
        this.task,
        this.boardId,
        this.columnId,
        this.source
      );
    }
  }

  toggleCompleted() {
    if (!this.task?.id || !this.columnId || !this.boardId) return;

    const newCompletedStatus = !this.task.completed;

    this.stateService.notifyTaskCompletionChange(
      this.boardId,
      this.columnId!,
      this.task.id,
      newCompletedStatus
    );

    this.taskService
      .updateTask(this.boardId, this.columnId, this.task.id, {
        completed: newCompletedStatus,
      })
      .subscribe({
        next: (updatedTask) => {
          this.task = { ...updatedTask };
          this.toggleClick.emit(updatedTask.completed);
        },
        error: (err) => console.error('Error updating task:', err),
      });
  }

  onDeleteClick() {
    this.deleteClick.emit();
  }
}
