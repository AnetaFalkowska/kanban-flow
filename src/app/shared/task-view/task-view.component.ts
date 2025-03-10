import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Inject,
  OnInit,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { Task } from '../../api/task.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-task-view',
  imports: [MatDialogModule, MatButtonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './task-view.component.html',
  styleUrl: './task-view.component.scss',
})
export class TaskViewComponent {
  readonly dialogRef = inject(MatDialogRef<TaskViewComponent>);
  readonly data = inject<{ task: Task; source: string }>(MAT_DIALOG_DATA);

  editTask() {
    this.dialogRef.close();
  }
}
