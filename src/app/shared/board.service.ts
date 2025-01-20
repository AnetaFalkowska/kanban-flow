import { Injectable } from '@angular/core';
import { Board } from './board.model';
import { BoardData } from '../../db-data';

@Injectable({
  providedIn: 'root',
})
export class BoardService {
  boards: Board[] = BoardData;
  constructor() {}

  getBoards() {
    return this.boards;
  }

  getBoard(id: string): Board | undefined{
    console.log(this.boards.find((b) => b.id === id));

    return this.boards.find((b) => b.id === id);
  }

  addBoard(board: Board): void {
    this.boards.push(board);
  }

  updateBoard(id: string, updatedFields: Partial<Board>): void {
    const board = this.getBoard(id);
    if (!board) return;

    console.log(updatedFields)


    //TODO updating logic
  }

  deleteBoard(id: string): void {
    const boardIndex = this.boards.findIndex((b) => b.id === id);
    if (boardIndex === -1) return;
    this.boards.splice(boardIndex, 1);
  }
}
