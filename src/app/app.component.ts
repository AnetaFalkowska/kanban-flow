import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { NavbarComponent } from "./core/layout/navbar/navbar.component";
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent, RouterModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  // animations: [
  //   trigger('routeAnimations', [
  //     transition('* <=> *', [
  //       style({ opacity: 0, transform: 'translateY(10px)' }),
  //       animate('200ms ease-out', style({ opacity: 1, transform: 'translateY(0)' })),
  //     ]),
  //   ]),
  // ],
})
export class AppComponent {
  title = 'kanban-flow';

  prepareRoute(outlet: any) {
    return outlet?.activatedRouteData?.['animation'];
  }
}
