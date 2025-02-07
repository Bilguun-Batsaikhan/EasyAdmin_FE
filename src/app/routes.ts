import { Routes } from '@angular/router';
import { FormContainerComponent } from './login-page/form-container/form-container.component';
import { HomeComponent } from './home-page/home/home.component';
import { UsersComponent } from './user-page/users/users.component';
import { authGuard } from './auth.guard';
import { AssetsComponent } from './asset-page/assets/assets.component';
import { AssetHistoryComponent } from './asset-history-page/asset-history/asset-history.component';
import { TicketsComponent } from './ticket-page/tickets/tickets.component';
import { TicketOpenComponent } from './ticket-page/ticket-open/ticket-open.component';
import { TicketCloseComponent } from './ticket-page/ticket-close/ticket-close.component';
import { ResetPasswordComponent } from './login-page/reset-password/reset-password.component';

const routeConfig: Routes = [
  {
    path: 'login',
    component: FormContainerComponent,
    title: 'Login Page',
  },
  {
    path: '',
    component: HomeComponent,
    title: 'Home Page',
  },
  {
    path: 'home',
    component: HomeComponent,
    title: 'Home Page',
  },
  {
    path: 'users',
    component: UsersComponent,
    title: 'Users Page',
    canActivate: [authGuard],
    data: { roles: ['SUPER_ADMIN', 'SYSTEM_ADMIN'] },
  },
  {
    path: 'assets',
    component: AssetsComponent,
    title: 'Assets Page',
    canActivate: [authGuard],
    data: { roles: ['SUPER_ADMIN', 'SYSTEM_ADMIN', 'USER'] },
  },
  {
    path: 'assets-history',
    component: AssetHistoryComponent,
    title: 'Assets History Page',
    canActivate: [authGuard],
    data: { roles: ['SUPER_ADMIN', 'SYSTEM_ADMIN'] },
  },
  {
    path: 'dashboard',
    component: TicketsComponent,
    title: 'Tickets Page',
    canActivate: [authGuard],
    data: { roles: ['SUPER_ADMIN', 'USER', 'SYSTEM_ADMIN'] },
  },
  {
    path: 'ticket-open',
    component: TicketOpenComponent,
    title: 'Open a Ticket',
    canActivate: [authGuard],
    data: { roles: ['USER'] },
  },
  {
    path: 'ticket-close',
    component: TicketCloseComponent,
    title: 'Close a Ticket',
    canActivate: [authGuard],
    data: { roles: ['SUPER_ADMIN', 'SYSTEM_ADMIN'] },
  },
  {
    path: 'reset-password',
    component: ResetPasswordComponent,
    title: 'Reset Password Page',
  },
];
export default routeConfig;
