import { Injectable } from '@angular/core';
import { Board } from './board.model';
import { BoardData } from '../../db-data';
import { Column } from './column.model';
import { from, map, Observable, switchMap, tap } from 'rxjs';
import {
  Firestore,
  addDoc,
  collection,
  collectionData,
  deleteDoc,
  doc,
  docData,
  updateDoc,
} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class BoardService {
  private boards;

  constructor(private firestore: Firestore) {
    this.boards = collection(this.firestore, 'boards');
  }

  getBoards(): Observable<Board[]> {
    console.log("get boards")
    const boardsRef = collection(this.firestore, 'boards');
    return collectionData(boardsRef, { idField: 'id' }) as Observable<Board[]>;
  }

  getBoard(id: string): Observable<Board | undefined> {
    console.log("get board")
    const boardDocRef = doc(this.firestore, `boards/${id}`);
    return docData(boardDocRef, { idField: 'id' }) as Observable<Board>;
  }

  addBoard(board: Board): Observable<string> {
    console.log("add board")
    const boardData = board.toJSON();
    const promise = addDoc(this.boards, boardData).then(
      (response) => response.id
    );
    return from(promise);
  }

  updateBoard(
    id: string,
    updatedFields: {
      boardName: string;
      items: { columnId: string; columnName: string; taskLimit: number }[];
    }
  ): Observable<void> {
    console.log("update board")
    const boardDocRef = doc(this.firestore, `boards/${id}`);

    return this.getBoard(id).pipe(
      switchMap((board) =>{
      if (!board) throw new Error(`Board with ID ${id} does not exist.`) 

      const updatedBoardName = updatedFields.boardName;
  
      const existingColumnsMap = new Map(
        board.columns.map((column) => [column.id, column])
      );
  
      const updatedColumns = updatedFields.items
        .map((item) => {
          const { columnId, columnName, taskLimit } = item;
  
          if (columnId.length === 0) {
            return new Column(columnName, [], taskLimit).toJSON();
          }
          const existingColumn = existingColumnsMap.get(columnId);
          if (existingColumn) {
            return {
              ...existingColumn,
              name: columnName,
              taskLimit: taskLimit,
            };
          }
  
          return null;
        })
        .filter((column) => column !== null);
  
      const updatedBoardData = {name: updatedBoardName, columns:updatedColumns};
      return from(updateDoc(boardDocRef, updatedBoardData))
    })
  );
}

  deleteBoard(id: string): Observable<void> {
    console.log("delete board")
    const boardDocRef = doc(this.firestore, `boards/${id}`);
    const promise = deleteDoc(boardDocRef);
    return from(promise);
  }
}