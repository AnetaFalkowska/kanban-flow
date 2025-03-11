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
import { StateService } from '../../core/services/state.service';

@Component({
  selector: 'app-task-list',
  imports: [CommonModule, FullCalendarModule, TaskCardComponent],
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
    displayEventTime: false,
    listDayFormat: { weekday: 'long' },
    listDaySideFormat: 'MMMM D, YYYY',
    events: [],
  };
  private unsubscribe$ = new Subject<void>();
  taskAnimationState: 'remove' | null = null;

  constructor(
    private readonly taskService: TaskService,
    private readonly calendarUtilsService: CalendarUtilsService,
    private readonly stateService: StateService
  ) {}

  @ViewChild('calendar') calendarComponent!: FullCalendarComponent;

  ngOnInit(): void {
    this.taskService.getIncompleteTasks();
    this.taskService.incompleteTasks$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((taskList) => this.updateCalendarOptions(taskList));
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  updateCalendarOptions(
    calendarTasks: {
      task: any;
      taskIndex: number;
      boardName: string;
      boardId: string;
      columnId: string;
    }[]
  ): void {
    this.calendarOptions = {
      ...this.calendarOptions,
      events: calendarTasks.map(
        ({ task, taskIndex, boardName, boardId, columnId }) => ({
          title: task.name,
          start: task.duedate,
          id: task.id,
          extendedProps: {
            task,
            taskIndex,
            boardName,
            boardId,
            columnId,
          },
          backgroundColor: this.calendarUtilsService.getPriorityColor(
            task.completed,
            task.priority,
            task.duedate
          ),
        })
      ),
      eventDidMount: function (info) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const duedate = info.event.start && new Date(info.event.start);
        const isCompleted = info.event.extendedProps['task'].completed;

        if (duedate && duedate < today) {
          info.el.style.backgroundColor = '#f6ceb2';
        }
      },
    };
  }

  isTaskOverdue(taskDate: string): boolean {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return new Date(taskDate) < today;
  }

  onDeleteTask(props: any) {
    const { boardId, columnId, task, taskIndex } = props;
    const taskId = task.id;

    if (boardId && columnId && taskId) {
      this.taskService
        .deleteTask(boardId, columnId, taskId, 'task-list')
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe({
          next: () =>
            this.stateService.storeDeletedTaskAndShowUndoSnackbar(
              boardId,
              columnId,
              taskIndex,
              task,
              'task-list'
            ),
          error: (err) => console.error('Failed to delete task:', err),
        });
    }
  }

  toggleCompleted(event: any, completed: boolean) {
    const { task } = event.extendedProps;
    this.calendarUtilsService.updatePriorityColor(
      event,
      completed,
      task.priority,
      task.duedate
    );
  }
}
