import { inject, Injectable } from '@angular/core';
import { TaskService } from '../../api/task.service';
import { StateService } from './state.service';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Task } from '../../api/task.model';
import { TaskViewComponent } from '../../shared/task-view/task-view.component';

@Injectable({
  providedIn: 'root',
})
export class CalendarUtilsService {
  constructor(
    private readonly dialog: MatDialog,
    private readonly router: Router,
    private readonly taskService: TaskService,
    private readonly stateService: StateService
  ) {}

  openDialog(task: Task, boardId: string, columnId: string): void {
    const dialogRef = this.dialog.open(TaskViewComponent, {
      data: { task, source: 'calendar' },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.stateService.setTaskContext(boardId, columnId);
        this.router.navigate([`/tasks/${task.id}/edit`]);
      }
      if (result === 'openBoard') {
        this.router.navigate([`/${boardId}`]);
      }
    });
  }

  handleEventClick(info: any) {
    const { boardId, columnId } = info.event.extendedProps;
    const taskId = info.event.id;

    if (!boardId || !columnId || !taskId) return;

    this.taskService.getTask(boardId, columnId, taskId).subscribe({
      next: (task) => {
        this.openDialog(task, boardId, columnId);
      },
    });
  }

  getPriorityColor(
    completed: boolean,
    priority: 'high' | 'medium' | 'low' | null,
    taskDate: string
  ): string {
    if (completed) {
      return 'gray';
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const taskDateFormatted = new Date(taskDate);

    if (taskDateFormatted < today) {
      return '#B63D2E';
    }

    const priorityColors = {
      high: '#8E1B5C',
      medium: '#D97706',
      low: '#2A6F97',
    } as const;

    return priorityColors[priority || 'low'];
  }
}
