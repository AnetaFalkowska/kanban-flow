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
    private boardService: BoardService,
    private columnService: ColumnService,
    private route: ActivatedRoute,
    private router: Router
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
      .subscribe({
        next: (board) => {
          this.board = board;
        },
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  drop(event: CdkDragDrop<{ id: string; name: string }[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  }

  updateBoardName(boardName: string) {
    if (this.board && boardName !== this.board.name) {
      this.boardService
        .updateBoardName(this.board.id, boardName)
        .subscribe(() => (this.board!.name = boardName));
    }
  }

  deleteBoard() {
    if (!this.board) return;

    this.boardService
      .deleteBoard(this.board.id)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: () => this.router.navigateByUrl(''),
        error: (err) => console.error('Failed to delete board:', err),
      });
  }

  onAddColumn() {
    if (!this.board) return;
    const newColumn = new Column('Column Name');
    this.columnService
      .addColumn(this.board.id, newColumn)
      .subscribe((createdColumn) => this.board!.columns.push(createdColumn));
  }

  onDeleteColumn(columnId: string) {
    if (!this.board) return;
    this.columnService
      .deleteColumn(this.board.id, columnId)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => {
        this.board!.columns = this.board!.columns.filter(
          (col) => col.id !== columnId
        );
      });
  }
}
