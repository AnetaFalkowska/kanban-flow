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
import { CalendarUtilsService } from '../../core/services/calendar-utils.service';
import { NgStyle } from '@angular/common';

@Component({
  selector: 'app-task-view',
  imports: [MatDialogModule, MatButtonModule, NgStyle],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './task-view.component.html',
  styleUrl: './task-view.component.scss',
})
export class TaskViewComponent {
  readonly dialogRef = inject(MatDialogRef<TaskViewComponent>);
  readonly data = inject<{ task: Task; source: string }>(MAT_DIALOG_DATA);

  constructor(private readonly calendarUtilsService: CalendarUtilsService) {}

  editTask() {
    this.dialogRef.close();
  }

  priorityWithOverdueStyle(
    completed: boolean,
    priority: 'high' | 'medium' | 'low' | null | undefined,
    duedate: String | undefined
  ) {
    return this.calendarUtilsService.getPriorityColorWithOverdue(
      completed,
      priority,
      duedate as string | undefined
    )
  }

  priorityStyle(priority: 'high' | 'medium' | 'low' | null | undefined) {
    return this.calendarUtilsService.getPriorityColor(

      priority,

    )
  }

  overdueStyle(data:any) {

    const {completed, duedate} = data.task;
    console.log(this.calendarUtilsService.isOverdue(completed,duedate))
    return this.calendarUtilsService.isOverdue(completed,duedate);
  }
}
