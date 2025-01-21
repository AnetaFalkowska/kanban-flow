import { Injectable } from '@angular/core';
import { Board } from './board.model';
import { BoardData } from '../../db-data';
import { Column } from './column.model';

@Injectable({
  providedIn: 'root',
})
export class BoardService {
  boards: Board[] = BoardData;
  constructor() {}

  getBoards() {
    return this.boards;
  }

  getBoard(id: string): Board | undefined {
    return this.boards.find((b) => b.id === id);
  }

  addBoard(board: Board): void {
    this.boards.push(board);
  }

  updateBoard(
    id: string,
    updatedFields: {
      boardName: string;
      items: { columnId: string; columnName: string; taskLimit: number }[];
    }
  ): void {
    const board = this.getBoard(id);
    if (!board) return;

    board.name = updatedFields.boardName;

    const existingColumnsMap = new Map(
      board.columns.map((column) => [column.id, column])
    );

    const updatedColumns = updatedFields.items
      .map((item) => {
        const { columnId, columnName, taskLimit } = item;

        if (columnId.length === 0) {
          return new Column(columnName, [], taskLimit);
        }
        const existingColumn = existingColumnsMap.get(columnId);
        if (existingColumn) {
          existingColumn.name = columnName;
          existingColumn.taskLimit = taskLimit;
          return existingColumn;
        }

        return null;
      })
      .filter((column) => column !== null);

    board.columns = updatedColumns;
  }

  deleteBoard(id: string): void {
    const boardIndex = this.boards.findIndex((b) => b.id === id);
    if (boardIndex === -1) return;
    this.boards.splice(boardIndex, 1);
  }
}
