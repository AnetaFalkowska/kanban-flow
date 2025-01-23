import { Component, OnInit } from '@angular/core';
import { BoardCardComponent } from '../board-card/board-card.component';
import { Board } from '../../shared/board.model';
import { BoardService } from '../../shared/board.service';
import { RouterModule } from '@angular/router';
import { JsonPipe } from '@angular/common';


@Component({
  selector: 'app-dashboard',
  imports: [BoardCardComponent, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  boards: Board[] = [];

  constructor(private boardService: BoardService) {}

  ngOnInit() {
    this.boards = this.boardService.getBoards();
    
  }
}
