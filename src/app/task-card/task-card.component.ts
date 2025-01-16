import { Component, Input } from '@angular/core';
import { Task } from '../shared/task.model';

@Component({
  selector: 'app-task-card',
  imports: [],
  templateUrl: './task-card.component.html',
  styleUrl: './task-card.component.scss'
})
export class TaskCardComponent {
@Input() task?:Task
}
