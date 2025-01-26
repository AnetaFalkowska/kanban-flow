import { Component, OnDestroy, OnInit } from '@angular/core';
import { BoardCardComponent } from '../board-card/board-card.component';
import { Board } from '../../shared/board.model';
import { BoardService } from '../../shared/board.service';
import { RouterModule } from '@angular/router';
import { distinctUntilChanged, pipe, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  imports: [BoardCardComponent, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit, OnDestroy {
  public boards: Board[] = [];
  public unsubscribe$ = new Subject<void>();

  constructor(private boardService: BoardService) {}

  ngOnInit(): void {
    this.boardService
      .getBoards()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (data) => {
          console.log('boards', data);
          this.boards = data;
        },
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
