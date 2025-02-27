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

@Component({
  selector: 'app-task-card',
  imports: [MatButtonModule, MatDialogModule],
  templateUrl: './task-card.component.html',
  styleUrl: './task-card.component.scss',
  // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskCardComponent implements OnInit {
  @Input() task?: Task;
  @Input() columnId?: string;
  @Input() boardId?: string;

  @Output() deleteClick: EventEmitter<void> = new EventEmitter<any>();

  readonly dialog = inject(MatDialog);
  private router = inject(Router);

  constructor(
    private readonly stateService: StateService,
    private readonly taskService: TaskService
  ) // private readonly cdr: ChangeDetectorRef
  {}

  ngOnInit() {
    console.log('from task card onInit: ', this.task?.completed);
  }

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

    if (!this.task || !this.columnId || !this.boardId) return;

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
        next: (updatedTask) => this.task = {...updatedTask},    
        error: (err) => console.error('Error updating task:', err),
      });
  }

  onDeleteClick() {
    this.deleteClick.emit();
  }
}
