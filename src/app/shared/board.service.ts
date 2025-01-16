import { Injectable } from '@angular/core';
import { Board } from './board.model';
import { BoardData } from '../../db-data';

@Injectable({
  providedIn: 'root',
})
export class BoardService {
  boards: Board[] = BoardData
  constructor() {}


  getBoards() {
    return this.boards
  }

  getBoard(id:string) {
    return this.boards.find(b => b.id === id)
  }

  addBoard(board:Board) {
    this.boards.push(board)
  }

  updateBoard(id:string, updatedFields:Partial<Board>) {
    const board = this.getBoard(id)
    if (!board) return;
    // updating logic
  }

  deleteBoard(id:string) {
    const boardIndex = this.boards.findIndex(b => b.id === id)
    if (boardIndex === -1) return;
    this.boards.splice(boardIndex,1)
    
  }


}
