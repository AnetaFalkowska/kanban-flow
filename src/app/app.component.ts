import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { NavbarComponent } from "./navbar/navbar.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent, RouterModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'kanban-flow';
}
