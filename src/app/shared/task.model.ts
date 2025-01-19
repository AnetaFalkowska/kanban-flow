import { v4 as uuidv4 } from 'uuid';

export class Task {
  id: string;
  priority?: 'low' | 'medium' | 'high';
  duedate?: Date;
  description?: string;

  constructor(
    public name: string,
  ) {
    this.id = uuidv4();
  }
}
