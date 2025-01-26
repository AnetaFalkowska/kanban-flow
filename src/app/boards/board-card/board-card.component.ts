import { Component, Input, OnInit } from '@angular/core';
import { Board } from '../../shared/board.model';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-board-card',
  imports: [RouterModule],
  templateUrl: './board-card.component.html',
  styleUrl: './board-card.component.scss',
})
export class BoardCardComponent {
  @Input() board?: Board;
}
