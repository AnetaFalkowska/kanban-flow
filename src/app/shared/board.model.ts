import { v4 as uuidv4 } from 'uuid';
import { Column } from './column.model';

export class Board {
  id?: string

  constructor(public name: string, public columns: Column[]) {
    if (columns.length < 1) {
      throw new Error('Board must have at least one column');
    }

    this.name = name.toUpperCase();
  }

  toJSON() {
    return {
      name: this.name,
      columns: this.columns.map((column) => ({
        name: column.name,
        taskLimit: column.taskLimit,
        tasks: column.tasks,
        id: column.id
      })),
    };
  }
}
