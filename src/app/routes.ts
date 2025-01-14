import { Routes } from '@angular/router';
import { FormContainerComponent } from './login-page/form-container/form-container.component';
import { HomeComponent } from './home-page/home/home.component';
import { UsersComponent } from './user-page/users/users.component';
import { authGuard } from './auth.guard';
import { AssetsComponent } from './asset-page/assets/assets.component';
import { AssetHistoryComponent } from './asset-history-page/asset-history/asset-history.component';
import { TicketsComponent } from './ticket-page/tickets/tickets.component';

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
    data: { roles: ['SUPER_ADMIN'] },
  },
  {
    path: 'assets',
    component: AssetsComponent,
    title: 'Assets Page',
    canActivate: [authGuard],
    data: { roles: ['SUPER_ADMIN', 'USER'] },
  },
  {
    path: 'assets-history',
    component: AssetHistoryComponent,
    title: 'Assets History Page',
    canActivate: [authGuard],
    data: { roles: ['SUPER_ADMIN'] },
  },
  {
    path: 'dashboard',
    component: TicketsComponent,
    title: 'Tickets Page',
    canActivate: [authGuard],
    data: { roles: ['SUPER_ADMIN', 'USER'] },
  },
];
export default routeConfig;
