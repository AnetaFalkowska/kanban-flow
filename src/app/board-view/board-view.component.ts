import { Component } from '@angular/core';
import { ColumnComponent } from "../column/column.component";

@Component({
  selector: 'app-board-view',
  imports: [ColumnComponent],
  templateUrl: './board-view.component.html',
  styleUrl: './board-view.component.scss'
})
export class BoardViewComponent {

}
