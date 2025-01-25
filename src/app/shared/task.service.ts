import { Injectable, OnInit } from '@angular/core';
import { Board } from './board.model';
import { BoardData } from '../../db-data';
import { Task } from './task.model';
import { BoardService } from './board.service';
import { doc, docData, Firestore } from '@angular/fire/firestore';
import { map } from 'rxjs';
import { Observable } from 'rxjs';
import { Column } from './column.model';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  constructor(private firestore: Firestore) {}

  getTasks(boardId: string, columnId: string): Observable<Task[]> {
    const boardDocRef = doc(this.firestore, `boards/${boardId}`);
    return docData(boardDocRef).pipe(
      map((board: any) => {
        const column = board.columns.find((c: Column) => c.id === columnId);
        return column ? column.tasks : [];
      })
    );
  }

  getTask(boardId: string, columnId: string, taskId: string): Observable<Task | undefined> {
    return this.getTasks(boardId, columnId).pipe(map(tasks => tasks.find(t=>t.id === taskId)))
  }


  //// TODO

  addTask(boardId: string, columnId: string, task: Task): void {
    const tasks = this.getTasks(boardId, columnId);
    tasks?.push(task);
  }

  updateTask(
    boardId: string,
    columnId: string,
    taskId: string,
    updatedFields: Partial<Task>
  ): void {
    const tasks = this.getTasks(boardId, columnId);
    const updatedTask = tasks?.find((t) => t.id === taskId);
    console.log(updatedFields);
    if (updatedTask) Object.assign(updatedTask, updatedFields);
    console.log(updatedTask);
  }

  deleteTask(boardId: string, columnId: string, taskId: string): void {
    const tasks = this.getTasks(boardId, columnId);
    const removedTaskId = tasks?.findIndex((t) => t.id === taskId);
    if (removedTaskId === -1) return;
    if (removedTaskId !== undefined && removedTaskId !== -1) {
      tasks?.splice(removedTaskId, 1);
    }
  }
}
