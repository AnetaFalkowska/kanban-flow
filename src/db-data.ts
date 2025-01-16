import { Board } from './app/shared/board.model';
import { Column } from './app/shared/column.model';
import { Task } from './app/shared/task.model';

export const BoardData = [
  new Board('job', [
    new Column('Todo', [
      new Task('Send email', 'high'),
      new Task('Meeting', 'high'),
      new Task('Phone call', 'medium'),
    ]),
    new Column('In progress', [
      new Task('Write report', 'high'),
      new Task('Prepare presentation', 'medium'),
      new Task('Review code', 'low'),
    ]),
    new Column('Done', [
      new Task('Submit report', 'high'),
      new Task('Send email follow-up', 'medium'),
      new Task('Code review', 'low'),
    ]),
  ]),

  new Board('personal', [
    new Column('Todo', [
      new Task('Buy groceries', 'medium'),
      new Task('Clean the house', 'low'),
      new Task('Pay bills', 'high'),
    ]),
    new Column('In progress', [
      new Task('Learn TypeScript', 'high'),
      new Task('Read a book', 'medium'),
    ]),
    new Column('Done', [
      new Task('Exercise', 'medium'),
      new Task('Cook dinner', 'low'),
    ]),
  ]),

  new Board('travel', [
    new Column('Todo', [
      new Task('Book tickets', 'high'),
      new Task('Pack luggage', 'medium'),
    ]),
    new Column('In progress', [
      new Task('Check weather forecast', 'low'),
      new Task('Research destinations', 'medium'),
    ]),
    new Column('Done', [new Task('Get travel insurance', 'high')]),
  ]),
  new Board('training', [new Column('Todo')]),
];
