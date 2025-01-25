import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
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
import { ActivatedRoute, ParamMap, Router, RouterModule } from '@angular/router';
import { StateService } from '../../shared/state.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-column',
  imports: [TaskCardComponent, DragDropModule, RouterModule],
  templateUrl: './column.component.html',
  styleUrl: './column.component.scss',
})
export class ColumnComponent implements OnInit, OnDestroy {
  @Input() column: Column = new Column('', []);
  @Output() dropEmitter = new EventEmitter<CdkDragDrop<Task[]>>();
  boardId: string | null = null;
  unsubscribe$ = new Subject<void>();

  constructor(
    private taskService: TaskService,
    private stateService: StateService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.paramMap
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((paramMap: ParamMap) => {
        this.boardId = paramMap.get('id');
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  onDrop(e: CdkDragDrop<Task[]>) {
    this.dropEmitter.emit(e);
  }

  onEditClick(task: Task) {
    if (this.boardId) {
      this.stateService.setTaskContext(this.boardId, this.column.id);
      this.router.navigate([`/tasks/${task.id}/edit`]);
    }
  }

  onDeleteClick(task: Task) {
    if (this.boardId) {
      this.taskService.deleteTask(this.boardId, this.column.id, task.id);
      this.stateService.clearTaskContext();
    }
  }

  onAddTask() {
    if (this.boardId) {
      console.log("from column: ", this.boardId, this.column)
      this.stateService.setTaskContext(this.boardId, this.column.id);
      this.router.navigate([`/tasks/add`]);
    }
  }
}
