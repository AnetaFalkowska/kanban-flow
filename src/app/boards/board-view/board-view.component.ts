import { Component, OnDestroy, OnInit } from '@angular/core';
import { ColumnComponent } from '../column/column.component';
import { Board } from '../../shared/board.model';
import { BoardService } from '../../shared/board.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-board-view',
  imports: [ColumnComponent],
  templateUrl: './board-view.component.html',
  styleUrl: './board-view.component.scss',
})
export class BoardViewComponent implements OnInit, OnDestroy {
  public board?: Board;
  private unsubscribe$ = new Subject<void>();

  constructor(
    private boardService: BoardService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.paramMap
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((paramMap: ParamMap) => {
        const idParam = paramMap.get('id');
        console.log(this.board);

        if (idParam) this.board = this.boardService.getBoard(idParam);
        console.log(this.board);
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
