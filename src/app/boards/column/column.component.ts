import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TaskCardComponent } from '../../task-card/task-card.component';
import { Task } from '../../shared/task.model';
import { Column } from '../../shared/column.model';
import {
  CdkDrag,
  CdkDragDrop,
  CdkDropList,
  DragDropModule,
} from '@angular/cdk/drag-drop';
import { TaskService } from '../../shared/task.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { StateService } from '../../shared/state.service';

@Component({
  selector: 'app-column',
  imports: [TaskCardComponent, DragDropModule],
  templateUrl: './column.component.html',
  styleUrl: './column.component.scss',
})
export class ColumnComponent implements OnInit {
  @Input() column: Column = { id: '', name: '', tasks: [] };
  @Output() dropEmitter = new EventEmitter<CdkDragDrop<any>>();
  boardId: string | null = null

  constructor(
    private taskService: TaskService,
    private stateService: StateService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((paramMap:ParamMap) => {
      this.boardId = paramMap.get('id')
    })

  }

  onDrop(e: CdkDragDrop<any>) {
    this.dropEmitter.emit(e);
  }

  onEditClick(task: Task) {
    this.stateService.setTaskContext(this.boardId, this.column.id)
    this.router.navigate([`/tasks/${task?.id}/edit`]);
  }

  onDeleteClick(task: Task) {
    if (this.boardId) {
      this.taskService.deleteTask(this.boardId, this.column.id, task.id);
    }
  }
}
