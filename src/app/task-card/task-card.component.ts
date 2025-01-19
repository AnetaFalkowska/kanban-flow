import { Component, Input, ViewEncapsulation } from '@angular/core';
import { Task } from '../shared/task.model';

@Component({
  selector: 'app-task-card',
  imports: [],
  templateUrl: './task-card.component.html',
  styleUrl: './task-card.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class TaskCardComponent {
@Input() task?:Task
}
