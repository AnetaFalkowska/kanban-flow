import { Injectable } from '@angular/core';
import { Board } from './board.model';
import { BoardData } from '../../db-data';
import { Task } from './task.model';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  boards: Board[] = BoardData;
  constructor() {}

  getTasks(boardId: string, columnId: string): Task[] | undefined {
    const column = this.boards
      ?.find((b) => b.id === boardId)
      ?.columns.find((c) => c.id === columnId);
    return column?.tasks;
  }

  getTask(boardId: string, columnId: string, taskId: string): Task | undefined {
    const tasks = this.getTasks(boardId, columnId);
    return tasks?.find((t) => t.id === taskId);
  }

  addTask(boardId: string, columnId: string, task: Task): void {
    const tasks = this.getTasks(boardId, columnId);
    tasks?.push(task);
  }

  updateTask(
    boardId: string,
    columnId: string,
    taskId: string,
    updatedFields: Partial<Task>
  ) {
    const tasks = this.getTasks(boardId, columnId);
    const updatedTask = tasks?.find((t) => t.id === taskId);
    if (updatedTask) Object.assign(updatedTask, updatedFields);
  }

  deleteTask(boardId: string, columnId: string, taskId: string) {
    const tasks = this.getTasks(boardId, columnId);
    const removedTaskId = tasks?.findIndex((t) => t.id === taskId);
    if (removedTaskId === -1) return;
    if (removedTaskId !== undefined && removedTaskId !== -1) {
      tasks?.splice(removedTaskId, 1);
    }
  }
}
