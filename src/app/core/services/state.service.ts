import { Injectable} from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { Task } from '../../api/task.model';
import { NotificationService } from './notification.service';
import { TaskService } from '../../api/task.service';

@Injectable({
  providedIn: 'root',
})
export class StateService {
  constructor(
    private readonly notificationService: NotificationService,
    private readonly taskService: TaskService
  ) {}

  private currentTaskContext$ = new BehaviorSubject<{
    boardId: string | null;
    columnId: string | null;
  } | null>(null);

  private taskCompletionChanges$ = new Subject<{
    boardId: string;
    columnId: string;
    taskId: string;
    completed: boolean;
  }>();

  private highlightedTask$ = new BehaviorSubject<{
    columnId: string;
    taskId: string;
  } | null>(null);

  private lastDeletedTask: {
    boardId: string;
    columnId: string;
    index: number;
    task: Task;
  } | null = null;

  get taskCompletionChanges() {
    return this.taskCompletionChanges$.asObservable();
  }

  get currentTaskCtx() {
    return this.currentTaskContext$.asObservable();
  }

  get highlightedTask() {
    return this.highlightedTask$.asObservable();
  }

  notifyTaskCompletionChange(
    boardId: string,
    columnId: string,
    taskId: string,
    completed: boolean
  ) {
    this.taskCompletionChanges$.next({ boardId, columnId, taskId, completed });
  }

  setTaskContext(boardId: string | null, columnId: string | null): void {
    this.currentTaskContext$.next({ boardId, columnId });
  }

  setBoardId(boardId: string | null): void {
    const currentContext = this.currentTaskContext$.getValue();
    this.currentTaskContext$.next({
      boardId,
      columnId: currentContext?.columnId ?? null,
    });
  }

  setColumnId(columnId: string | null): void {
    const currentContext = this.currentTaskContext$.getValue();
    this.currentTaskContext$.next({
      boardId: currentContext?.boardId ?? null,
      columnId,
    });
  }

  getTaskContext(): { boardId: string | null; columnId: string | null } | null {
    return this.currentTaskContext$.getValue();
  }

  clearTaskContext(): void {
    this.currentTaskContext$.next(null);
  }

  setHighlightedTask(columnId: string, taskId: string) {
    this.highlightedTask$.next({ columnId, taskId });
  }

  clearHighlightedTask(): void {
    this.highlightedTask$.next(null);
  }

  setLastDeletedTask(
    boardId: string,
    columnId: string,
    index: number,
    task: Task
  ) {
    this.lastDeletedTask = { boardId, columnId, index, task };
  }

  getLastDeletedTask() {
    return this.lastDeletedTask;
  }

  clearLastDeletedTask() {
    this.lastDeletedTask = null;
  }

  storeDeletedTaskAndShowUndoSnackbar(
    boardId: string,
    columnId: string,
    taskIndex: number,
    task: Task,
    source: string,
    restoreInUIFn?: (
      lastDeletedTask: {
        boardId: string;
        columnId: string;
        index: number;
        task: Task;
      },
      restoredTask: Task
    ) => void
  ) {
    if (taskIndex !== -1) {
      this.setLastDeletedTask(boardId, columnId, taskIndex, task);
    }

    this.notificationService.openSnackBar('Task deleted', 'Undo', 4000, () => {
      this.restoreTask(source, restoreInUIFn);
    });
  }

  restoreTask(
    source: string,
    restoreInUIFn:
      | ((
          lastDeletedTask: {
            boardId: string;
            columnId: string;
            index: number;
            task: Task;
          },
          restoredTask: Task
        ) => void)
      | undefined
  ) {
    const lastDeletedTask = this.getLastDeletedTask();

    if (lastDeletedTask) {
      this.taskService
        .restoreTask(
          lastDeletedTask.boardId,
          lastDeletedTask.columnId,
          lastDeletedTask.task,
          lastDeletedTask.index,
          source
        )
        .subscribe((restoredTask) => {
          if (restoreInUIFn) restoreInUIFn(lastDeletedTask, restoredTask);
          this.clearLastDeletedTask();
        });
    }
  }
}
