import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { FullCalendarModule } from '@fullcalendar/angular';
import { FullCalendarComponent } from '@fullcalendar/angular';
import { Calendar, CalendarOptions } from '@fullcalendar/core';
import multiMonthPlugin from '@fullcalendar/multimonth';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { TaskService } from '../shared/task.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-calendar',
  imports: [CommonModule, RouterOutlet, FullCalendarModule],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss',
})
export class CalendarComponent implements OnInit, OnDestroy {
  calendarOptions!: CalendarOptions;
  unsubscribe$ = new Subject<void>();

  constructor(private readonly taskService: TaskService) {}

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

      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,multiMonthYear', // Przycisk do przełączania
      },

      views: {
        multiMonthYear: {
          type: 'multiMonthYear',
          duration: { months: 12 },
          multiMonthMaxColumns: 3,
          buttonText: 'year',
        },
      },
      events: calendarTasks.map(({ task, boardName, boardId, columnId }) => ({
        title: `${task.name} (${boardName})`,
        start: task.duedate,
        id: task.id,
        extendedProps: {
          priority: task.priority,
          boardId,
          columnId,
        },
        backgroundColor: this.getPriorityColor(task.priority, task.duedate),
        borderColor: this.getPriorityColor(task.priority, task.duedate),
      })),
      eventStartEditable: true,
      droppable: true,
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
    const { boardId, columnId, priority } = info.event.extendedProps;

    const taskId = info.event.id;
    const newDueDate = info.event.startStr;

    if (!boardId || !columnId || !taskId || !newDueDate) return;
    info.event.setProp(
      'backgroundColor',
      this.getPriorityColor(priority, newDueDate)
    );
    info.event.setProp(
      'borderColor',
      this.getPriorityColor(priority, newDueDate)
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

  handleEventClick(event: any) {
    console.log(event.event.title);
  }

  getPriorityColor(priority: string, taskDate: string): string {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const taskDateFormatted = new Date(taskDate);
    if (taskDateFormatted >= today) {
      return priority === 'high'
        ? 'red'
        : priority === 'medium'
        ? 'orange'
        : 'green';
    } else return 'gray';
  }

  // switchToYearView() {
  //   let calendarApi = this.calendarComponent.getApi();
  //   calendarApi.changeView('multiMonthYear');
  // }
}
