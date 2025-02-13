import { Component, OnDestroy, OnInit } from '@angular/core';
import { BoardCardComponent } from '../board-card/board-card.component';
import { Board } from '../../shared/board.model';
import { BoardService } from '../../shared/board.service';
import { RouterModule } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-dashboard',
  imports: [BoardCardComponent, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  // animations: [
  //   trigger('boardAnim', [
  //     transition(':enter', [
  //       style({ opacity: 0, transform: 'scale(0.85)' }),
  //       animate(
  //         '350ms 50ms ease-out',
  //         style({ opacity: 1, transform: 'scale(1)' })
  //       )
  //     ])
  //   ])
  // ],
})

export class DashboardComponent implements OnInit, OnDestroy {
  boards: Board[] = [];
  private readonly unsubscribe$ = new Subject<void>();

  constructor(private readonly boardService: BoardService) {}

  ngOnInit() {
    this.boardService
      .getBoards()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((res) => (this.boards = res));
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
