import { Injectable } from '@angular/core';
import { Board } from './board.model';
import { BoardData } from '../../db-data';
import { Column } from './column.model';
import { catchError, Observable, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class BoardService {
  boards: Board[] = BoardData;
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
    return this.http.post<Board>(this.API_URL, board, {headers:{'Content-Type':'application/json'}}).pipe(
      catchError((err) => {
        console.error('Error adding board: ', err);
        return throwError(() => new Error('Error adding board'));
      })
    );
  }

  // updateBoard(
  //   id: string,
  //   updatedFields: {
  //     boardName: string;
  //     items: { columnId: string; columnName: string; taskLimit: number }[];
  //   }
  // ): void {
  //   const board = this.getBoard(id);
  //   if (!board) return;

  //   board.name = updatedFields.boardName;

  //   const existingColumnsMap = new Map(
  //     board.columns.map((column) => [column.id, column])
  //   );

  //   const updatedColumns = updatedFields.items
  //     .map((item) => {
  //       const { columnId, columnName, taskLimit } = item;

  //       if (columnId.length === 0) {
  //         return new Column(columnName, [], taskLimit);
  //       }
  //       const existingColumn = existingColumnsMap.get(columnId);
  //       if (existingColumn) {
  //         existingColumn.name = columnName;
  //         existingColumn.taskLimit = taskLimit;
  //         return existingColumn;
  //       }

  //       return null;
  //     })
  //     .filter((column) => column !== null);

  //   board.columns = updatedColumns;
  // }

  deleteBoard(id: string): void {
    const boardIndex = this.boards.findIndex((b) => b.id === id);
    if (boardIndex === -1) return;
    this.boards.splice(boardIndex, 1);
  }
}
