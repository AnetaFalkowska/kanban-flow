import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TaskService } from '../../../api/task.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent implements OnInit {
  overdueCount: number = 0;

  constructor(private readonly taskService: TaskService) {}

  ngOnInit(): void {
    this.taskService.countOverdueTasks();
    this.taskService.overdueTasksCount$.subscribe(
      (overdueCount) => (this.overdueCount = overdueCount)
    );
  }
}
