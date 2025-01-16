import { v4 as uuidv4 } from 'uuid';
import { Column } from './column.model';

export class Board {
  id: string;

  constructor(public name: string, public columns: Column[]) {
    if (columns.length < 1) {
      throw new Error('Board must have at least one column');
    }
    this.id = uuidv4();
    this.name = name.toUpperCase();
  }
}
