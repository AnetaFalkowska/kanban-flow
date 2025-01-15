import { Component } from '@angular/core';
import { BoardCardComponent } from '../board-card/board-card.component';

@Component({
  selector: 'app-dashboard',
  imports: [BoardCardComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

}
