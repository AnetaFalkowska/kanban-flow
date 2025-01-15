import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CalendarComponent } from './calendar/calendar.component';
import { SettingsComponent } from './settings/settings.component';
import { NotificationsComponent } from './notifications/notifications.component';

export const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'calendar', component: CalendarComponent },
  { path: 'settings', component: SettingsComponent },
  { path: 'notifications', component: NotificationsComponent },
];
