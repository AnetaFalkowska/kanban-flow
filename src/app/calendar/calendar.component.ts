import { Component, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
import { FullCalendarModule } from '@fullcalendar/angular';
import { FullCalendarComponent } from '@fullcalendar/angular';
import { CalendarOptions } from '@fullcalendar/core';
import multiMonthPlugin from '@fullcalendar/multimonth';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { TaskService } from '../shared/task.service';
import { Subject, takeUntil } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { TaskViewComponent } from '../task-view/task-view.component';
import { Task } from '../shared/task.model';
import { StateService } from '../shared/state.service';

@Component({
  selector: 'app-calendar',
  imports: [CommonModule, RouterOutlet, FullCalendarModule],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss',
})
export class CalendarComponent implements OnInit, OnDestroy {
  calendarOptions!: CalendarOptions;
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
    this.taskService.tasksForCalendar$.subscribe((calendarTasks) =>
      this.updateCalendarOptions(calendarTasks)
    );
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
        backgroundColor: this.getPriorityColor(task.completed, task.priority, task.duedate),
        borderColor: this.getPriorityColor(task.completed, task.priority, task.duedate),
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
    const { boardId, columnId } = info.event.extendedProps;
    const taskId = info.event.id;

    if (!boardId || !columnId || !taskId) return;

    this.taskService.getTask(boardId, columnId, taskId).subscribe({
      next: (task) => {
        this.openDialog(task, boardId, columnId);
      },
    });
  }

  getPriorityColor(completed:boolean, priority: "high" | "medium" | "low" | null , taskDate: string): string {

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
        low: '#2A6F97'
    } as const;

    return priorityColors[priority || "low"]
    
  }

  // switchToYearView() {
  //   let calendarApi = this.calendarComponent.getApi();
  //   calendarApi.changeView('multiMonthYear');
  // }
}
