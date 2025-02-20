import { Component, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { FullCalendarModule } from '@fullcalendar/angular';
import { FullCalendarComponent } from '@fullcalendar/angular';
import { CalendarOptions } from '@fullcalendar/core';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import momentPlugin from '@fullcalendar/moment';
import { TaskService } from '../shared/task.service';
import { Subject, takeUntil } from 'rxjs';
import { CalendarUtilsService } from '../shared/calendar-utils.service';

@Component({
  selector: 'app-task-list',
  imports: [CommonModule, RouterOutlet, FullCalendarModule],
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
    eventClick: this.handleEventClick.bind(this),
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
    this.calendarUtilsService.handleEventClick(info);
  }

  getPriorityColor(
    completed: boolean,
    priority: 'high' | 'medium' | 'low' | null,
    taskDate: string
  ): string {
    return this.calendarUtilsService.getPriorityColor(
      completed,
      priority,
      taskDate
    );
  }
}
