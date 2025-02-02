import { Injectable } from '@angular/core';
import { Board } from './board.model';
import { BoardData } from '../../db-data';
import { Column } from './column.model';
import { catchError, map, Observable, switchMap, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class BoardService {
  private readonly API_URL = 'http://localhost:3000/api/boards';
  constructor(private http: HttpClient) {}

  handleError(action: string) {
    return (error: any) => {
      console.error(`Error ${action}: `, error);
      return throwError(() => new Error(`Error ${action}}`));
    };
  }

  getBoards(): Observable<Board[]> {
    return this.http
      .get<Board[]>(this.API_URL)
      .pipe(catchError(this.handleError('getting boards')));
  }

  getBoard(id: string): Observable<Board> {
    return this.http
      .get<Board>(`${this.API_URL}/${id}`)
      .pipe(catchError(this.handleError('getting board')));
  }

  addBoard(board: Board): Observable<Board> {
    return this.http
      .post<Board>(this.API_URL, board, {
        headers: { 'Content-Type': 'application/json' },
      })
      .pipe(catchError(this.handleError('adding board')));
  }

  updateBoardName(
    id: string,
    updatedFields: {
      boardName: string;
    }
  ): Observable<Board> {
    return this.http.put<Board>(`${this.API_URL}/${id}`, {name:updatedFields.boardName}).pipe(catchError(this.handleError('updating board name')));      
  }

  deleteBoard(id: string): Observable<void> {
    return this.http
      .delete<void>(`${this.API_URL}/${id}`)
      .pipe(catchError(this.handleError('deleting board')));
  }
}
