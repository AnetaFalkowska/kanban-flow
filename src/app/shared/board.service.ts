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

  getBoards(): Observable<Board[]> {
    return this.http.get<Board[]>(this.API_URL).pipe(
      catchError((err) => {
        console.error('Error fetching boards: ', err);
        return throwError(() => new Error('Error fetching boards'));
      })
    );
  }

  getBoard(id: string): Observable<Board> {
    return this.http.get<Board>(`${this.API_URL}/${id}`).pipe(
      catchError((err) => {
        console.error('Error fetching board: ', err);
        return throwError(() => new Error('Error fetching board'));
      })
    );
  }

  addBoard(board: Board): Observable<Board> {
    return this.http
      .post<Board>(this.API_URL, board, {
        headers: { 'Content-Type': 'application/json' },
      })
      .pipe(
        catchError((err) => {
          console.error('Error adding board: ', err);
          return throwError(() => new Error('Error adding board'));
        })
      );
  }

  updateBoard(
    id: string,
    updatedFields: {
      boardName: string;
      items: { columnId: string; columnName: string; taskLimit: number }[];
    }
  ): Observable<Board> {
    return this.getBoard(id).pipe(
      map((board) => {
        if (!board) return throwError(() => new Error('Board not found'));

        board.name = updatedFields.boardName;

        const existingColumnsMap = new Map(
          board.columns.map((column) => [column.id, column])
        );

        board.columns = updatedFields.items
          .map((item) => {
            const { columnId, columnName, taskLimit } = item;

            if (!columnId) {
              return new Column(columnName, [], taskLimit);
            }
            const existingColumn = existingColumnsMap.get(columnId);
            if (existingColumn) {
              return { ...existingColumn, name: columnName, taskLimit };
            }

            return null;
          })
          .filter((column) => column !== null) as Column[];

        return board;
      }),

      switchMap((updatedBoard) =>
        this.http.put<Board>(`${this.API_URL}/${id}`, updatedBoard, {
          headers: { 'Content-Type': 'application/json' },
        })
      ),
      catchError((err) => {
        console.error('Error updating board: ', err);
        return throwError(() => new Error('Error updating board'));
      })
    );
  }

  deleteBoard(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`).pipe(
      catchError((err) => {
        console.error('Error deleting board: ', err);
        return throwError(() => new Error('Error deleting board'));
      })
    );
  }
}
