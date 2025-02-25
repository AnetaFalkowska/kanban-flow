import { Routes } from '@angular/router';
import { DashboardComponent } from './domain/dashboard/dashboard.component';
import { CalendarComponent } from './domain/calendar/calendar.component';
import { SettingsComponent } from './domain/settings/settings.component';
import { NotificationsComponent } from './domain/notifications/notifications.component';
import { BoardViewComponent } from './domain/dashboard/board-card/board-view/board-view.component';
import { BoardFormComponent } from './domain/dashboard/board-form/board-form.component';
import { TaskFormComponent } from './shared/task-form/task-form.component';
import { TaskListComponent } from './domain/task-list/task-list.component';

export const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'add', component: BoardFormComponent },
  { path: 'calendar', component: CalendarComponent },
  { path: 'settings', component: SettingsComponent },
  { path: 'notifications', component: TaskListComponent },
  { path: ':id', component: BoardViewComponent },
  { path: ':id/edit', component: BoardFormComponent },
  { path: 'tasks/add', component: TaskFormComponent },
  { path: 'tasks/:taskId/edit', component: TaskFormComponent },
  { path: 'tasks/add', component: TaskFormComponent },
];
