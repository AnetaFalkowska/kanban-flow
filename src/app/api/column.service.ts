import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { Column } from './column.model';
import { TaskService } from './task.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ColumnService {
  private readonly API_URL = environment.apiUrl + 'api/boards';
  constructor(private http: HttpClient, private taskService:TaskService) {}

  handleError(action: string) {
    return (error: any) => {
      console.error(`Error ${action}: `, error);
      return throwError(() => new Error(`Error ${action}}`));
    };
  }

  addColumn(boardId: string, column: Column) {
    return this.http
      .post<Column>(`${this.API_URL}/${boardId}/columns/`, column, {
        headers: { 'Content-Type': 'application/json' },
      })
      .pipe(catchError(this.handleError('adding column')));
  }

  updateColumnName(
    boardId: string,
    columnId: string,
    updatedColumnName: string
  ): Observable<Column> {
    console.log('updating in service')
    return this.http
      .put<Column>(
        `${this.API_URL}/${boardId}/columns/${columnId}`,
        {name:updatedColumnName}
      )
      .pipe(catchError(this.handleError('updating column name')));
  }

  deleteColumn(boardId: string, columnId: string): Observable<void> {
    return this.http
      .delete<void>(`${this.API_URL}/${boardId}/columns/${columnId}`)
      .pipe(
        tap(() => {this.taskService.countOverdueTasks()}),
        catchError(this.handleError('deleting column')));
  }
}
