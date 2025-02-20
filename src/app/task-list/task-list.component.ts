import { Component, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
import { FullCalendarModule } from '@fullcalendar/angular';
import { FullCalendarComponent } from '@fullcalendar/angular';
import { CalendarOptions } from '@fullcalendar/core';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import momentPlugin from '@fullcalendar/moment';
import { TaskService } from '../shared/task.service';
import { Subject, takeUntil } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { TaskViewComponent } from '../task-view/task-view.component';
import { Task } from '../shared/task.model';
import { StateService } from '../shared/state.service';

@Component({
  selector: 'app-task-list',
  imports: [CommonModule, RouterOutlet, FullCalendarModule],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.scss',
})
export class TaskListComponent implements OnInit, OnDestroy {
  
  calendarOptions: CalendarOptions = {
    plugins: [listPlugin, interactionPlugin,  momentPlugin],
    initialView: 'listYear',
    height: 'auto',
    listDayFormat:{weekday: 'long'},
    listDaySideFormat:'MMMM D, YYYY',
    events: [],
    eventClick: this.handleEventClick.bind(this),
  };
  unsubscribe$ = new Subject<void>();
  readonly dialog = inject(MatDialog);
  private router = inject(Router);

  constructor(
    private readonly taskService: TaskService,
    private readonly stateService: StateService
  ) {}

  @ViewChild('calendar') calendarComponent!: FullCalendarComponent;

  ngOnInit(): void {
    this.taskService.getTasksForCalendar();
    this.taskService
      .getIncompleteTasksForList()
      .subscribe((taskList) => this.updateCalendarOptions(taskList));
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

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

  updateCalendarOptions(
    calendarTasks: {
      task: any;
      boardName: string;
      boardId: string;
      columnId: string;
    }[]
  ): void {
    this.calendarOptions = {
      ...this.calendarOptions, // Kopiujemy istniejące opcje
      events: calendarTasks.map(({ task, boardName, boardId, columnId }) => ({
        title: task.name,
        start: task.duedate,
        id: task.id,
        extendedProps: {
          completed: task.completed,
          priority: task.priority,
          boardName,
          boardId,
          columnId,
        },
        backgroundColor: this.getPriorityColor(
          task.completed,
          task.priority,
          task.duedate
        ),
        borderColor: this.getPriorityColor(
          task.completed,
          task.priority,
          task.duedate
        ),
      })),
    };
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
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const taskDateFormatted = new Date(taskDate);
    const isFutureOrToday = taskDateFormatted >= today;

    if (completed) {
      return isFutureOrToday ? 'green' : 'gray';
    }

    const priorityColors: Record<'high' | 'medium' | 'low', string> = {
      high: isFutureOrToday ? 'crimson' : '#ff6b7e',
      medium: isFutureOrToday ? '#fe6639' : 'lightsalmon',
      low: isFutureOrToday ? '#2aa0cd' : '#87ceeb',
    };

    return priorityColors[priority || 'low'];
  }
}
