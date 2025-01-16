import { Component, OnInit } from '@angular/core';
import { ColumnComponent } from "../column/column.component";
import { Board } from '../shared/board.model';
import { BoardService } from '../shared/board.service';
import { ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'app-board-view',
  imports: [ColumnComponent],
  templateUrl: './board-view.component.html',
  styleUrl: './board-view.component.scss'
})
export class BoardViewComponent implements OnInit {

  board?:Board

  constructor(private boardService:BoardService, private route:ActivatedRoute) {

  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((paramMap:ParamMap) => {
      const idParam = paramMap.get("id")
      if (idParam) this.board = this.boardService.getBoard(idParam)
    })
  }

}
