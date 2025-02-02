import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { Column } from './column.model';

@Injectable({
  providedIn: 'root',
})
export class ColumnService {
  private readonly API_URL = 'http://localhost:3000/api/boards';
  constructor(private http: HttpClient) {}

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
    return this.http
      .put<Column>(
        `${this.API_URL}/${boardId}/columns/${columnId}`,
        updatedColumnName
      )
      .pipe(catchError(this.handleError('updating column name')));
  }

  deleteColumn(boardId: string, columnId: string): Observable<void> {
    return this.http
      .delete<void>(`${this.API_URL}/${boardId}/columns/${columnId}`)
      .pipe(catchError(this.handleError('deleting column')));
  }
}
