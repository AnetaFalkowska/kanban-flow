import { inject, Injectable } from '@angular/core';
import { TaskService } from '../../api/task.service';
import { StateService } from './state.service';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Task } from '../../api/task.model';
import { TaskViewComponent } from '../../shared/task-view/task-view.component';
import { DialogService } from './dialog.service';

@Injectable({
  providedIn: 'root',
})
export class CalendarUtilsService {
  private readonly priorityColors = {
    high: '#246c09',
    // high: '#122D52',
    medium: '#619c26',
    // medium: '#2C4F7C',
    low: '#aac865',
    // low: '#4A6FA5',
    completed: '#b0b0b0',
    overdue: '#e3622b',
    // overdue: 'crimson',
  } as const;

  constructor(private readonly taskService: TaskService) {}

  getPriorityColorWithOverdue(
    completed: boolean,
    priority: 'high' | 'medium' | 'low' | null | undefined,
    taskDate?: string
  ): string {
    if (completed) return this.priorityColors.completed;
    return this.isTaskOverdue(taskDate)
    ? this.priorityColors.overdue
    : this.getPriorityColor(priority);

  }

  getTextColor(
    completed: boolean,
    priority: 'high' | 'medium' | 'low' | null,
    taskDate: string
  ): string {
    if (completed) return 'lightgray';
    return this.isTaskOverdue(taskDate) || priority !== 'low'
      ? 'white'
      : 'darkslategray';
  }

  updatePriorityColor(
    event: any,
    completed: boolean,
    priority: 'high' | 'medium' | 'low' | null,
    newDueDate: string
  ) {
    const updatedPriorityColor = this.getPriorityColorWithOverdue(
      completed,
      priority,
      newDueDate
    );
    event.setProp('backgroundColor', updatedPriorityColor);
    event.setProp('borderColor', updatedPriorityColor);
  }

  getPriorityColor(priority: 'high' | 'medium' | 'low' | null | undefined):string {
    return this.priorityColors[priority || 'low'];
  }

  isOverdue(completed: boolean, taskDate?: string): string | undefined {
    console.log(completed, taskDate);
    console.log(this.isTaskOverdue(taskDate));
    console.log(this.priorityColors.overdue);
    return completed ? undefined : (this.isTaskOverdue(taskDate) ? this.priorityColors.overdue : undefined);
  }

  private isTaskOverdue(taskDate?: string): boolean {
    if (!taskDate) return false;
    const today = new Date().setHours(0, 0, 0, 0);
    return new Date(taskDate).setHours(0, 0, 0, 0) < today;
  }

}
