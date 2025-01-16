import { Component, Input } from '@angular/core';
import { TaskCardComponent } from "../task-card/task-card.component";
import { Task } from '../shared/task.model';
import { Column } from '../shared/column.model';

@Component({
  selector: 'app-column',
  imports: [TaskCardComponent],
  templateUrl: './column.component.html',
  styleUrl: './column.component.scss'
})
export class ColumnComponent {

  @Input() column?:Column



}
