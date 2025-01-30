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

@Component({
  selector: 'app-board-view',
  imports: [ColumnComponent, DragDropModule, RouterModule],
  templateUrl: './board-view.component.html',
  styleUrl: './board-view.component.scss',
})
export class BoardViewComponent implements OnInit, OnDestroy {
  public board?: Board;
  private unsubscribe$ = new Subject<void>();

  constructor(
    private boardService: BoardService,
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
      .subscribe({ next: (board) => (this.board = board) });
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
}
