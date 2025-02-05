import { Injectable } from '@angular/core';
import { Board } from './board.model';
import { BoardData } from '../../db-data';
import { Task } from './task.model';
import { BoardService } from './board.service';
import { catchError, map, Observable, switchMap, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private readonly API_URL = 'http://localhost:3000/api/boards';

  handleError(action: string) {
    return (error: any) => {
      console.error(`Error ${action}: `, error);
      return throwError(() => new Error(`Error ${action}}`));
    };
  }

  constructor(private http: HttpClient) {}

  getTask(boardId: string, columnId: string, taskId: string): Observable<Task> {
    return this.http
      .get<Task>(
        `${this.API_URL}/${boardId}/columns/${columnId}/tasks/${taskId}`
      )
      .pipe(catchError(this.handleError('getting task')));
  }

  addTask(boardId: string, columnId: string, task: Task): Observable<Task> {
    console.log("service:", task)
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
}
