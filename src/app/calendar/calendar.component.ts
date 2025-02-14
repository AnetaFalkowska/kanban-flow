import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions } from '@fullcalendar/core';
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
      plugins: [dayGridPlugin, interactionPlugin],
      initialView: 'dayGridMonth',
      firstDay: 1,
      events: calendarTasks.map(({ task, boardName, boardId, columnId }) => ({
        title: `${task.name} (${boardName})`,
        start: task.duedate,
        backgroundColor: this.getPriorityColor(task.priority),
        borderColor: this.getPriorityColor(task.priority),
        id: task.id,
        extendedProps: {
          boardId,
          columnId,
        },
      })),
      eventStartEditable: true,
      droppable: true,
      eventDrop: this.handleEventDrop.bind(this),
      eventClick: this.handleEventClick.bind(this),
    };
  }

  getPriorityColor(priority?: string) {
    return priority === 'high'
      ? 'red'
      : priority === 'medium'
      ? 'orange'
      : 'green';
  }

  handleEventDrop(event: any) {

    const boardId = event.event.extendedProps.boardId;
    const columnId = event.event.extendedProps.columnId;
    const taskId = event.event.id; 
    const newDueDate = event.event.start ? this.formatDate(event.event.start) : null;
 
    if (!boardId || !columnId || !taskId || !newDueDate) return;

    this.taskService
      .updateTask(boardId, columnId, taskId, {
        duedate: newDueDate,
      })
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        error: (err) => console.error('Task update failed', err),
      });
  }

  formatDate(date: Date): string {
    return date.getFullYear() +
    '-' + String(date.getMonth() + 1).padStart(2, '0') +
    '-' + String(date.getDate()).padStart(2, '0');
  }

  handleEventClick(event: any) {
    console.log(event.event.title);
  }
}
