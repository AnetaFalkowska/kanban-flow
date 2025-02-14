import { Injectable } from '@angular/core';
import { Board } from './board.model';
import { BoardData } from '../../db-data';
import { Task } from './task.model';
import { BoardService } from './board.service';
import {
  BehaviorSubject,
  catchError,
  map,
  Observable,
  throwError,
} from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private readonly API_URL = 'http://localhost:3000/api/boards';
  private tasksSubject$ = new BehaviorSubject<
    { task: Task; boardName: string; boardId:string; columnId:string }[]
  >([]);
  tasksForCalendar$ = this.tasksSubject$.asObservable();

  handleError(action: string) {
    return (error: any) => {
      console.error(`Error ${action}: `, error);
      return throwError(() => new Error(`Error ${action}`));
    };
  }

  constructor(private http: HttpClient) {}

  getTasksForCalendar(): void {
    this.http
      .get<Board[]>(this.API_URL)
      .pipe(
        map((boards) => {
          let tasksWithDueDate: { task: Task; boardName: string; boardId:string; columnId:string }[] = [];

          boards.forEach((board) => {
            board.columns.forEach((column) => {
              column.tasks.forEach((task) => {
                if (task.duedate) {
                  tasksWithDueDate.push({ task, boardName: board.name, boardId: board.id, columnId: column.id });
                }
              });
            });
          });
           return tasksWithDueDate;
        }),
        catchError(this.handleError('getting tasks for calendar'))
      )
      .subscribe({
        next: (tasks) => this.tasksSubject$.next(tasks),
        error: (error) => console.error('Failed to load calendar tasks', error),
      });
  }

  getTask(boardId: string, columnId: string, taskId: string): Observable<Task> {
    return this.http
      .get<Task>(
        `${this.API_URL}/${boardId}/columns/${columnId}/tasks/${taskId}`
      )
      .pipe(catchError(this.handleError('getting task')));
  }

  addTask(boardId: string, columnId: string, task: Task): Observable<Task> {
    return this.http
      .post<Task>(`${this.API_URL}/${boardId}/columns/${columnId}/tasks/`, task)
      .pipe(catchError(this.handleError('adding task')));
  }

  updateTask(
    boardId: string,
    columnId: string,
    taskId: string,
    updatedFields: Partial<Task>
  ): Observable<Task> {
    return this.http
      .put<Task>(
        `${this.API_URL}/${boardId}/columns/${columnId}/tasks/${taskId}`,
        updatedFields
      )
      .pipe(catchError(this.handleError('updating task')));
  }

  deleteTask(
    boardId: string,
    columnId: string,
    taskId: string
  ): Observable<void> {
    return this.http
      .delete<void>(
        `${this.API_URL}/${boardId}/columns/${columnId}/tasks/${taskId}`
      )
      .pipe(catchError(this.handleError('deleting task')));
  }

  moveTask(
    boardId: string,
    sourceColumnId: string,
    taskId: string,
    targetColumnId: string,
    newIndex: number
  ): Observable<Task> {
    return this.http.put<Task>(
      `${this.API_URL}/${boardId}/columns/${sourceColumnId}/tasks/${taskId}/move/${targetColumnId}`,
      { newIndex }
    );
  }
}
