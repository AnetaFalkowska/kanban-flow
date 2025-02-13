import { v4 as uuidv4 } from 'uuid';

export class Task {
  id: string;
  name: string;
  description?: string;
  priority?: 'low' | 'medium' | 'high';
  duedate?: String;

  constructor(
    data: Partial<Task>
  ) {
    this.id = uuidv4();
    this.name = data.name || '';
    this.description = data.description;
    this.priority = data.priority;
    this.duedate = data.duedate;
  }
}
