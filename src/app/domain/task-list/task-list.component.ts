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
import { TaskCardComponent } from '../../shared/task-card/task-card.component';
import { animate, style, transition, trigger } from '@angular/animations';


@Component({
  selector: 'app-task-list',
  imports: [CommonModule, FullCalendarModule, TaskCardComponent],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.scss',
  animations: [
      trigger('taskAnim', [
        transition('remove => void', [
          animate(150, style({ opacity: 0, height: 0 })),
        ]),
      ]),
    ],
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
    // eventClick: (info: any) => {
    //   this.calendarUtilsService.handleEventClick(info);
    // },
  };
  private unsubscribe$ = new Subject<void>();

  constructor(
    private readonly taskService: TaskService,
    private readonly calendarUtilsService: CalendarUtilsService
  ) {}

  @ViewChild('calendar') calendarComponent!: FullCalendarComponent;

  ngOnInit(): void {
    this.taskService.getIncompleteTasks();
    this.taskService.incompleteTasks$.pipe(takeUntil(this.unsubscribe$)).subscribe((taskList) =>
      this.updateCalendarOptions(taskList)
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

  onDeleteTask(props: any) {
    
    const { boardId, columnId, task } = props;
    const taskId = task.id;

    if (boardId && columnId && taskId) {
      this.taskService
        .deleteTask(boardId, columnId, taskId)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe();
    }
  }

  toggleCompleted(event:any, completed:boolean) {
    const {task} = event.extendedProps;
    this.calendarUtilsService.updatePriorityColor(event, completed, task.priority, task.duedate)
  }
}
