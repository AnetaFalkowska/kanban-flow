import { Component, OnInit } from '@angular/core';
import { RouterModule, RouterOutlet, UrlSegment } from '@angular/router';
import { NavbarComponent } from './core/layout/navbar/navbar.component';
import {
  animate,
  group,
  query,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { AsyncPipe, DatePipe } from '@angular/common';
import { map, Observable, timer } from 'rxjs';
import { TaskService } from './api/task.service';

const baseStyles = style({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
});

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent, RouterModule, AsyncPipe, DatePipe],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'kanban-flow';
  dateTime!: Observable<Date>

  constructor(private taskService:TaskService) {

  }

ngOnInit() {
  this.dateTime = timer(0, 1000).pipe(
    map(() => {
      const now = new Date();

      if (now.getHours() === 0 && now.getMinutes() === 0 && now.getSeconds() === 0) {
        this.taskService.countOverdueTasks();
      }
      
      return now;
    })
  );
}

  prepareRoute(outlet: RouterOutlet) {
    if (outlet.isActivated) {
      const tab = outlet.activatedRouteData['tab'];
      if (!tab) return 'secondary';
      return tab;
    }
  }
}
