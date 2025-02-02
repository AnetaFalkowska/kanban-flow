import { Injectable } from '@angular/core';
import { Board } from './board.model';
import { BoardData } from '../../db-data';
import { Task } from './task.model';
import { BoardService } from './board.service';
import { catchError, map, Observable, switchMap, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private readonly API_URL = 'http://localhost:3000/api/boards';

  handleError(action: string) {
    return (error: any) => {
      console.error(`Error ${action}: `, error);
      return throwError(() => new Error(`Error ${action}}`));
    };
  }

  constructor(private http: HttpClient, private boardService: BoardService) {}

  getTasks(boardId: string, columnId: string): Observable<Task[]> {
    return this.boardService.getBoard(boardId).pipe(
      map((board) => {
        if (!board) throw new Error('Board not found');
        const column = board.columns.find((c) => c.id === columnId);
        if (!column) throw new Error('Column not found');
        return column.tasks;
      }),
      catchError(this.handleError('fetching tasks'))
    );
  }

  getTask(boardId: string, columnId: string, taskId: string): Observable<Task> {
    return this.getTasks(boardId, columnId).pipe(
      map((tasks) => {
        const task = tasks.find((t) => t.id === taskId);
        if (!task) throw new Error('Task not found');
        return task;
      }),
      catchError(this.handleError('fetching task'))
    );
  }

  modifyBoard(
    boardId: string,
    columnId: string,
    modifyFn: (tasks: Task[]) => Task[]
  ): Observable<Board> {
    return this.boardService.getBoard(boardId).pipe(
      map((board) => {
        if (!board) throw new Error('Board not found');
        const columnIndex = board.columns.findIndex((c) => c.id === columnId);
        if (columnIndex === -1) throw new Error('Column not found');

        const updatedColumn = {
          ...board.columns[columnIndex],
          tasks: modifyFn(board.columns[columnIndex].tasks),
        };

        console.log("From modifyBoard: ",updatedColumn);

        const updatedColumns = [...board.columns];
        updatedColumns[columnIndex] = updatedColumn;

        const updatedBoard = { ...board, columns: updatedColumns };

        return updatedBoard;
      }),
      switchMap((updatedBoard) =>
        this.http
          .put<Board>(`${this.API_URL}/${boardId}`, updatedBoard, {
            headers: { 'Content-Type': 'application/json' },
          })
          .pipe(catchError(this.handleError('adding task')))
      )
    );
  }

  addTask(boardId: string, columnId: string, task: Task): Observable<Board> {
    return this.modifyBoard(boardId, columnId, (tasks) => [...tasks, task]);
  }

  updateTask(
    boardId: string,
    columnId: string,
    taskId: string,
    updatedFields: Partial<Task>
  ): Observable<Board> {
    return this.modifyBoard(boardId, columnId, (tasks) =>
      tasks.map((task) =>
        task.id === taskId ? { ...task, ...updatedFields } : task
      )
    );
  }

  deleteTask(
    boardId: string,
    columnId: string,
    taskId: string
  ): Observable<Board> {
    console.log('deleting in service');
    return this.modifyBoard(boardId, columnId, (tasks) =>
      {const updatedTasks = tasks.filter((task) => task.id !== taskId);

    console.log('Before deletion:', tasks);
    console.log('After deletion:', updatedTasks);

    return updatedTasks;}
    );
  }
}
