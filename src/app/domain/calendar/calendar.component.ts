import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FullCalendarModule } from '@fullcalendar/angular';
import { FullCalendarComponent } from '@fullcalendar/angular';
import { CalendarOptions } from '@fullcalendar/core';
import multiMonthPlugin from '@fullcalendar/multimonth';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { TaskService } from '../../api/task.service';
import { Subject, takeUntil } from 'rxjs';
import { CalendarUtilsService } from '../../core/services/calendar-utils.service';
import { DialogService } from '../../core/services/dialog.service';
import { NotificationService } from '../../core/services/notification.service';

@Component({
  selector: 'app-calendar',
  imports: [CommonModule, FullCalendarModule],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss',
})
export class CalendarComponent implements OnInit, OnDestroy {
  calendarOptions!: CalendarOptions;
  unsubscribe$ = new Subject<void>();
  eventDropAllowed = true;

  constructor(
    private readonly taskService: TaskService,
    private readonly calendarUtilsService: CalendarUtilsService,
    private readonly dialogService: DialogService,
    private readonly notificationService: NotificationService
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
          duration: { years: 1 },
          multiMonthMaxColumns: 3,
          buttonText: 'year',
          aspectRatio: 1.35,
        },
      },
      events: calendarTasks.map(({ task, boardName, boardId, columnId }) => {
        const priorityColor = this.calendarUtilsService.getPriorityColorWithOverdue(
          task.completed,
          task.priority,
          task.duedate
        );

        return {
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
          backgroundColor: priorityColor,
          borderColor: priorityColor,
          textColor: this.calendarUtilsService.getTextColor(
            task.completed,
            task.priority,
            task.duedate
          ),
        };
      }),
      eventStartEditable: true,
      droppable: true,
      eventDidMount: ({ el, event }: { el: HTMLElement; event: any }) => {
        el.setAttribute(
          'title',
          `Task: ${event.title} | Board: ${event.extendedProps.boardName}`
        );
      },
      eventAllow: this.handleEventAllow.bind(this),
      eventDragStop: this.handleEventDragStop.bind(this),
      eventDrop: this.handleEventDrop.bind(this),
      eventClick: this.handleEventClick.bind(this),
      datesSet: () => this.scrollToCurrentMonth(),
    };
  }

  handleEventClick(info: any) {
    const { boardId, columnId } = info.event.extendedProps;
    const taskId = info.event.id;

    if (!boardId || !columnId || !taskId) return;

    this.taskService.getTask(boardId, columnId, taskId).subscribe({
      next: (task) => {
        this.dialogService.openTaskDialog(
          task,
          boardId,
          columnId,
          'calendar'
        );
      },
    });
  }

  handleEventAllow(info: any): boolean {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    this.eventDropAllowed = info.start >= today;
    return this.eventDropAllowed;
  }

  handleEventDragStop(info: any): void {
    if (!this.eventDropAllowed) {
      this.notificationService.openSnackBar('Cannot move tasks to past dates!', undefined, 2000);
    }
  }

  handleEventDrop(info: any) {
    const { boardId, columnId, completed, priority } = info.event.extendedProps;

    const taskId = info.event.id;
    const newDueDate = info.event.startStr;

    if (!boardId || !columnId || !taskId || !newDueDate) return;

    this.calendarUtilsService.updatePriorityColor(
      info.event,
      completed,
      priority,
      newDueDate
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

  // switchToYearView() {
  //   let calendarApi = this.calendarComponent.getApi();
  //   calendarApi.changeView('multiMonthYear');
  // }

  scrollToCurrentMonth(): void {
    setTimeout(() => {
      const today = new Date();
      const currentMonth = today.toLocaleString('en-US', { month: 'long' });  
      const months = document.querySelectorAll('.fc-multimonth-month');
        
      for (const month of months) {
        const header = month.querySelector('.fc-multimonth-title');
        if (header?.textContent?.toLowerCase().includes(currentMonth.toLowerCase())) {
          month.scrollIntoView({ behavior: 'smooth', block: 'center' });
          break;
        }
      }
    }, 0);
  }
}
