import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TaskCardComponent } from '../../task-card/task-card.component';
import { Task } from '../../shared/task.model';
import { Column } from '../../shared/column.model';
import {
  CdkDrag,
  CdkDragDrop,
  CdkDropList,
  DragDropModule,
  CdkDragPlaceholder,
} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-column',
  imports: [TaskCardComponent, DragDropModule],
  templateUrl: './column.component.html',
  styleUrl: './column.component.scss',
})
export class ColumnComponent {
  @Input() column: Column = { id: '', name: '', tasks: [] }
  @Output() dropEmitter = new EventEmitter<CdkDragDrop<any>>();

  onDrop(e: CdkDragDrop<any>) {
    this.dropEmitter.emit(e);
  }
}
