import { inject, Injectable } from '@angular/core';
import { TaskService } from '../../api/task.service';
import { StateService } from './state.service';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Task } from '../../api/task.model';
import { TaskViewComponent } from '../../shared/task-view/task-view.component';
import { TaskDialogService } from './task-dialog.service';

@Injectable({
  providedIn: 'root',
})
export class CalendarUtilsService {

  private readonly priorityColors = {
    high: '#6A1B9A',
    medium: '#AB47BC',
    low: '#E1BEE7',
    completed: '#b0b0b0',
    overdue: '#B63D2E',
  } as const;

  constructor(
    private readonly taskDialogService: TaskDialogService,
    private readonly taskService: TaskService,
  ) {}


  handleEventClick(info: any) {
    const { boardId, columnId } = info.event.extendedProps;
    const taskId = info.event.id;

    if (!boardId || !columnId || !taskId) return;

    this.taskService.getTask(boardId, columnId, taskId).subscribe({
      next: (task) => {
        this.taskDialogService.openTaskDialog(task, boardId, columnId, 'calendar');
      },
    });
  }

  getPriorityColor(
    completed: boolean,
    priority: 'high' | 'medium' | 'low' | null | undefined,
    taskDate: string | undefined
  ): string {
    if (completed) return this.priorityColors.completed;
    if (!taskDate) return this.priorityColors.low;
    
    const today = new Date().setHours(0, 0, 0, 0);
    const taskDateFormatted = new Date(taskDate).setHours(0, 0, 0, 0);

    if (taskDateFormatted < today) return this.priorityColors.overdue

    return this.priorityColors[priority || 'low'];
  }

  getTextColor(
    completed: boolean,
    priority: 'high' | 'medium' | 'low' | null,
    taskDate: string
  ): string {
    if (completed) return 'lightgray'
    const today = new Date().setHours(0, 0, 0, 0);
    const taskDateFormatted = new Date(taskDate).setHours(0, 0, 0, 0);
    return taskDateFormatted >= today && (priority === 'low' || !priority) ? 'darkslategray' : 'white'
  }
}
