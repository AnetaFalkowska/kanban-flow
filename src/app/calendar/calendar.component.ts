import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { FullCalendarModule } from '@fullcalendar/angular';
import { FullCalendarComponent } from '@fullcalendar/angular';
import { CalendarOptions } from '@fullcalendar/core';
import multiMonthPlugin from '@fullcalendar/multimonth';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { TaskService } from '../shared/task.service';
import { Subject, takeUntil } from 'rxjs';
import { CalendarUtilsService } from '../shared/calendar-utils.service';

@Component({
  selector: 'app-calendar',
  imports: [CommonModule, RouterOutlet, FullCalendarModule],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss',
})
export class CalendarComponent implements OnInit, OnDestroy {
  calendarOptions!: CalendarOptions;
  unsubscribe$ = new Subject<void>();

  constructor(
    private readonly taskService: TaskService,
    private readonly calendarUtilsService: CalendarUtilsService
  ) {}

  @ViewChild('calendar') calendarComponent!: FullCalendarComponent;

  ngOnInit(): void {
    this.taskService.getTasksForCalendar();
    this.taskService.tasksForCalendar$.subscribe((calendarTasks) =>
      this.updateCalendarOptions(calendarTasks)
    );
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
      plugins: [dayGridPlugin, interactionPlugin, multiMonthPlugin],
      initialView: 'dayGridMonth',
      firstDay: 1,
      height: 'auto',
      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,multiMonthYear',
      },
      views: {
        multiMonthYear: {
          type: 'multiMonthYear',
          duration: { months: 12 },
          multiMonthMaxColumns: 3,
          buttonText: 'year',
          aspectRatio: 1.35,
        },
      },
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
      eventStartEditable: true,
      droppable: true,
      eventDidMount: ({ el, event }: { el: HTMLElement, event: any }) => {
        el.setAttribute('title', `Task: ${event.title} | Board: ${event.extendedProps.boardName}`);
      },
      eventAllow: this.handleEventAllow.bind(this),
      eventDrop: this.handleEventDrop.bind(this),
      eventClick: this.handleEventClick.bind(this),
    };
  }

  handleEventAllow(info: any): boolean {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return info.start >= today;
  }

  handleEventDrop(info: any) {
    const { boardId, columnId, completed, priority } = info.event.extendedProps;

    const taskId = info.event.id;
    const newDueDate = info.event.startStr;

    if (!boardId || !columnId || !taskId || !newDueDate) return;
    info.event.setProp(
      'backgroundColor',
      this.getPriorityColor(completed, priority, newDueDate)
    );
    info.event.setProp(
      'borderColor',
      this.getPriorityColor(completed, priority, newDueDate)
    );
    this.taskService
      .updateTask(boardId, columnId, taskId, {
        duedate: newDueDate,
      })
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        error: (err) => console.error('Task update failed', err),
      });
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

  // switchToYearView() {
  //   let calendarApi = this.calendarComponent.getApi();
  //   calendarApi.changeView('multiMonthYear');
  // }
}
