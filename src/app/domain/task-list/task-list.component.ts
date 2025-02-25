import { Component, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FullCalendarModule } from '@fullcalendar/angular';
import { FullCalendarComponent } from '@fullcalendar/angular';
import { CalendarOptions } from '@fullcalendar/core';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import momentPlugin from '@fullcalendar/moment';
import { TaskService } from '../../api/task.service';
import { Subject, takeUntil } from 'rxjs';
import { CalendarUtilsService } from '../../core/services/calendar-utils.service';

@Component({
  selector: 'app-task-list',
  imports: [CommonModule, FullCalendarModule],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.scss',
})
export class TaskListComponent implements OnInit, OnDestroy {
  calendarOptions: CalendarOptions = {
    plugins: [listPlugin, interactionPlugin, momentPlugin],
    initialView: 'listYear',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'listMonth,listYear',
    },
    views: {
      listMonth: {
        type: 'listMonth',
        buttonText: 'month',
      },
      listYear: {
        type: 'listYear',
        buttonText: 'year',
      },
    },
    height: 'auto',
    listDayFormat: { weekday: 'long' },
    listDaySideFormat: 'MMMM D, YYYY',
    events: [],
    eventClick: (info: any) => {
      this.calendarUtilsService.handleEventClick(info);
    },
  };
  unsubscribe$ = new Subject<void>();

  constructor(
    private readonly taskService: TaskService,
    private readonly calendarUtilsService: CalendarUtilsService
  ) {}

  @ViewChild('calendar') calendarComponent!: FullCalendarComponent;

  ngOnInit(): void {
    this.taskService
      .getIncompleteTasksForList()
      .subscribe((taskList) => this.updateCalendarOptions(taskList));
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
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
      ...this.calendarOptions,
      events: calendarTasks.map(({ task, boardName, boardId, columnId }) => ({
        title: task.name,
        start: task.duedate,
        id: task.id,
        extendedProps: {
          task,
          boardName,
          boardId,
          columnId,
        },
        backgroundColor: this.calendarUtilsService.getPriorityColor(
          task.completed,
          task.priority,
          task.duedate
        ),
      })),
    };
  }

  isTaskOverdue(taskDate: string): boolean {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return new Date(taskDate) < today;
  }
}
