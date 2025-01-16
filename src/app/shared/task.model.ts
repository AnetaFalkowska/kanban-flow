import { v4 as uuidv4 } from 'uuid';

export class Task {
  id: string;
  duedate?: Date;
  description?: string;

  constructor(
    public name: string,
    public priority: 'low' | 'medium' | 'high'
  ) {
    this.id = uuidv4();
  }
}
