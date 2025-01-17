import { Routes } from '@angular/router';
import { DashboardComponent } from './boards/dashboard/dashboard.component';
import { CalendarComponent } from './calendar/calendar.component';
import { SettingsComponent } from './settings/settings.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { BoardViewComponent } from './boards/board-view/board-view.component';
import { AddBoardComponent } from './boards/add-board/add-board.component';

export const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'add', component: AddBoardComponent },
  { path: 'calendar', component: CalendarComponent },
  { path: 'settings', component: SettingsComponent },
  { path: 'notifications', component: NotificationsComponent },
  { path: ':id', component: BoardViewComponent },
];
