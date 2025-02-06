import { Component, OnDestroy, OnInit } from '@angular/core';
import { ColumnComponent } from '../column/column.component';
import { Board } from '../../shared/board.model';
import { BoardService } from '../../shared/board.service';
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
import { EditableHeaderComponent } from '../../editable-header/editable-header.component';
import { ColumnService } from '../../shared/column.service';
import { Column } from '../../shared/column.model';
import { TaskService } from '../../shared/task.service';
import { Task } from '../../shared/task.model';

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
})
export class BoardViewComponent implements OnInit, OnDestroy {
  public board?: Board;
  private unsubscribe$ = new Subject<void>();

  constructor(
    private readonly boardService: BoardService,
    private readonly columnService: ColumnService,
    private readonly taskService: TaskService,
    private readonly route: ActivatedRoute,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        map((paramMap: ParamMap) => paramMap.get('id')),
        switchMap((boardId) => {
          return boardId ? this.boardService.getBoard(boardId) : of(undefined);
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
    const task = event.previousContainer.data.tasks[event.previousIndex]

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

    this.movetask(
      sourceColumnId,
      task.id,
      targetColumnId,
      newIndex
    );
  }

  movetask(
    columnId: string,
    taskId: string,
    targetColumnId: string,
    newIndex: number
  ) {
    this.taskService
      .moveTask(this.board!.id, columnId, taskId, targetColumnId, newIndex)
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
