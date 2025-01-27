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
import { map, of, ReplaySubject, Subject, switchMap, takeUntil } from 'rxjs';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
  CdkDrag,
  CdkDropList,
  DragDropModule,
} from '@angular/cdk/drag-drop';
import { Task } from '../../shared/task.model';

@Component({
  selector: 'app-board-view',
  imports: [ColumnComponent, DragDropModule, RouterModule],
  templateUrl: './board-view.component.html',
  styleUrl: './board-view.component.scss',
})
export class BoardViewComponent implements OnInit, OnDestroy {
  public board?: Board;
  private unsubscribe$ = new Subject<void>();
  private isDeleting = false;

  constructor(
    private boardService: BoardService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
  
    this.route.paramMap

      .pipe(           
        map((paramMap: ParamMap) => paramMap.get('id')),
        switchMap((idParam) => {
          return idParam ? this.boardService.getBoard(idParam) : of(undefined);
        }),
        takeUntil(this.unsubscribe$)
      )
      .subscribe((board) => {
        if (!this.isDeleting) {
          this.board = board;
          console.log('view board on init: ', this.board);
        }
      });
  }

  ngOnDestroy(): void {
    console.log('destroy done');
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  drop(event: CdkDragDrop<Task[]>) {
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
    if (this.board?.id) {
      this.isDeleting = true
      console.log('start delete: ', this.board.id);
      this.boardService
        .deleteBoard(this.board.id)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe({
          next: () => {
            console.log(
              `Board with ID ${this.board?.id} deleted successfully.`
            );
            this.isDeleting = false;
            this.router.navigateByUrl('');
          },
        });
    }
  }
}
