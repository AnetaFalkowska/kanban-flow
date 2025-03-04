import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { Board } from '../../api/board.model';
import { BoardService } from '../../api/board.service';

@Injectable({
  providedIn: 'root',
})
export class StateService {
  constructor(private boardService: BoardService) {}

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
}
