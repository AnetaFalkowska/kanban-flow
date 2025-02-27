import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { ColumnComponent } from './column/column.component';
import { Board } from '../../../../api/board.model';
import { BoardService } from '../../../../api/board.service';
import {
  ActivatedRoute,
  ParamMap,
  Router,
  RouterModule,
} from '@angular/router';
import { map, of, Subject, switchMap, takeUntil } from 'rxjs';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
  CdkDrag,
  CdkDropList,
  DragDropModule,
} from '@angular/cdk/drag-drop';
import { EditableHeaderComponent } from '../../../../shared/editable-header/editable-header.component';
import { ColumnService } from '../../../../api/column.service';
import { Column } from '../../../../api/column.model';
import { TaskService } from '../../../../api/task.service';
import { Task } from '../../../../api/task.model';
import { StateService } from '../../../../core/services/state.service';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-board-view',
  imports: [
    ColumnComponent,
    DragDropModule,
    RouterModule,
    EditableHeaderComponent,
  ],
  templateUrl: './board-view.component.html',
  styleUrl: './board-view.component.scss',
  animations: [
    trigger('boardViewAnim', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.85)' }),
        animate(
          '350ms 50ms ease-out',
          style({ opacity: 1, transform: 'scale(1)' })
        ),
      ]),
    ]),
  ],
})
export class BoardViewComponent implements OnInit, AfterViewInit, OnDestroy {
  public board?: Board;
  private unsubscribe$ = new Subject<void>();

  constructor(
    private readonly boardService: BoardService,
    private readonly columnService: ColumnService,
    private readonly taskService: TaskService,
    private readonly stateService: StateService,
    private readonly route: ActivatedRoute,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.stateService.taskCompletionChanges.subscribe(
      ({ boardId, columnId, taskId, completed }) => {
        if (!this.board || this.board.id !== boardId) return;

        const columnIndex = this.board.columns.findIndex(
          (col) => col.id === columnId
        );
        if (columnIndex === -1) return;

        const taskIndex = this.board.columns[columnIndex].tasks.findIndex(
          (t) => t.id === taskId
        );
        if (taskIndex === -1) return;

        const updatedTask = {
          ...this.board.columns[columnIndex].tasks[taskIndex],
          completed,
        };
        const updatedColumn = {
          ...this.board.columns[columnIndex],
          tasks: this.board.columns[columnIndex].tasks.map((task, i) =>
            i === taskIndex ? updatedTask : task
          ),
        };
        this.board = {
          ...this.board,
          columns: this.board.columns.map((col, i) =>
            i === columnIndex ? updatedColumn : col
          ),
        };
      }
    );
  }

  ngAfterViewInit(): void {
    this.route.paramMap
      .pipe(
        map((paramMap: ParamMap) => paramMap.get('id')),
        switchMap((boardId) => {
          if (boardId) {
            this.stateService.setBoardId(boardId);
            return this.boardService.getBoard(boardId);
          }
          return of(undefined);
        }),

        takeUntil(this.unsubscribe$)
      )
      .subscribe((board) => (this.board = board));
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  drop(event: CdkDragDrop<{ tasks: Task[]; columnId: string }>) {
    const sourceColumnId = event.previousContainer.data.columnId;
    const targetColumnId = event.container.data.columnId;
    const newIndex = event.currentIndex;
    const task = event.previousContainer.data.tasks[event.previousIndex];
    console.log('from drop: ', task);

    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data.tasks,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data.tasks,
        event.container.data.tasks,
        event.previousIndex,
        event.currentIndex
      );
    }

    this.movetask(sourceColumnId, task.id, targetColumnId, newIndex);
  }

  movetask(
    sourceColumnId: string,
    taskId: string,
    targetColumnId: string,
    newIndex: number
  ) {
    this.taskService
      .moveTask(
        this.board!.id,
        sourceColumnId,
        taskId,
        targetColumnId,
        newIndex
      )
      .pipe(
        switchMap(() =>
          this.taskService.getTask(this.board!.id, targetColumnId, taskId)
        )
      )
      .subscribe({
        error: (err) => console.error('Failed to update board name:', err),
      });
  }

  onUpdateBoardName(boardName: string) {
    if (this.board && boardName !== this.board.name) {
      this.boardService.updateBoardName(this.board.id, boardName).subscribe({
        error: (err) => console.error('Failed to update board name:', err),
      });
    }
  }

  onDeleteBoard() {
    if (!this.board) return;
    this.boardService
      .deleteBoard(this.board.id)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: () => this.router.navigateByUrl('/'),
        error: (err) => console.error('Failed to delete board:', err),
      });
  }

  onAddColumn() {
    if (!this.board) return;
    const newColumn = new Column('Column Name');
    this.columnService.addColumn(this.board.id, newColumn).subscribe({
      next: (createdColumn) => {
        this.board = {
          id: this.board!.id,
          name: this.board!.name,
          columns: [...this.board!.columns, createdColumn],
        };
      },
      error: (err) => console.error('Failed to add column:', err),
    });
  }

  onDeleteColumn(columnId: string) {
    if (!this.board) return;
    this.columnService
      .deleteColumn(this.board.id, columnId)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: () => {
          this.board = {
            id: this.board!.id,
            name: this.board!.name,
            columns: this.board!.columns.filter((col) => col.id !== columnId),
          };
        },
        error: (err) => console.error('Failed to delete column:', err),
      });
  }
}
