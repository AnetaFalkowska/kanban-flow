import { Routes } from '@angular/router';
import { DashboardComponent } from './boards/dashboard/dashboard.component';
import { CalendarComponent } from './calendar/calendar.component';
import { SettingsComponent } from './settings/settings.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { BoardViewComponent } from './boards/board-view/board-view.component';
import { BoardFormComponent } from './boards/board-form/board-form.component';
import { TaskFormComponent } from './task-form/task-form.component';

export const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'add', component: BoardFormComponent },
  { path: 'calendar', component: CalendarComponent },
  { path: 'settings', component: SettingsComponent },
  { path: 'notifications', component: NotificationsComponent },
  { path: ':id', component: BoardViewComponent },
  { path: ':id/edit', component: BoardFormComponent },
  { path: 'tasks/:taskId/edit', component: TaskFormComponent },
  { path: 'tasks/add', component: TaskFormComponent },
];
